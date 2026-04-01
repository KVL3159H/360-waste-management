import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../hooks/useAppData';
import type { Bin } from '../../hooks/useAppData';
import { analyzeBinPhoto } from '../../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { QrReader } from 'react-qr-reader';
import { QrCode, Camera, CheckCircle, Navigation, AlertCircle, Recycle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Bin Icons based on fill level
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const yellowIcon = new L.Icon({
  ...redIcon.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
});

const greenIcon = new L.Icon({
  ...redIcon.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
});

export default function CollectorDashboard() {
  const { profile } = useAuth();
  const { bins, routes, loading, setBins } = useAppData();
  
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [qrScanningState, setQrScanningState] = useState<'idle' | 'success' | 'error'>('idle');
  const [visionData, setVisionData] = useState<{fillPercentage: number | null, wasteType: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (loading || !routes.length) return <div>Loading route area...</div>;

  // Assumed collector gets the first route in this mock
  const activeRoute = routes[0]; 
  const routeBins = bins
    .filter(b => activeRoute.binsToCollect.includes(b.id))
    .sort((a, b) => b.fillLevel - a.fillLevel); // Priority sort: most filled first

  const handleScanObject = (result: any, error: any) => {
    if (result && qrScanningState === 'idle') {
      console.log('Scanned UID:', result?.text);
      setQrScanningState('success');
      setTimeout(() => {
        // Complete pickup simulation
        setBins(prev => prev.map(b => b.id === selectedBinId ? { ...b, fillLevel: 0, status: 'Green', lastEmptied: new Date().toISOString() } : b));
        setQrScanningState('idle');
        setIsQrModalOpen(false);
      }, 2000);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setVisionData(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
       const result = event.target?.result as string;
       // strip data uri prefix
       const base64Data = result.split(',')[1];
       const data = await analyzeBinPhoto(base64Data, file.type);
       setVisionData(data);
       setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const routeCoordinates = routeBins.map(b => [b.location.lat, b.location.lng] as [number, number]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full"> 
      
      {/* Route List */}
      <div className="xl:col-span-1 h-[calc(100vh-8rem)] flex flex-col gap-6">
        <Card className="glass shadow-lg flex-1 overflow-visible relative flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] pointer-events-none z-0" />
          <CardHeader className="bg-white/40 pb-4 z-10 border-b border-gray-100/50 flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-secondary" />
              Assigned Route: Zone North
            </CardTitle>
            <CardDescription className="flex items-center justify-between">
              <span>{routeBins.length} locations pending</span>
              <Badge variant="blue" className="bg-blue-100">{activeRoute.completedBins.length} completed</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto z-10 flex-1 hide-scrollbar">
            <div className="divide-y divide-gray-100/50">
               {routeBins.map((bin, index) => {
                  const isCompleted = bin.fillLevel === 0;
                  return (
                    <motion.div 
                      key={bin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 ${isCompleted ? 'bg-gray-50/50 opacity-60' : 'bg-white/30 hover:bg-white/60'} transition-colors relative group`}
                    >
                      {/* Priority indicator line */}
                      {!isCompleted && <div className={`absolute left-0 top-0 bottom-0 w-1 ${bin.status === 'Red' ? 'bg-red-500' : bin.status === 'Yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} />}
                      
                      <div className="flex justify-between items-start gap-4 ml-1">
                        <div>
                           <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800 text-sm">BIN-{bin.id.toUpperCase()}</span>
                              <Badge variant={bin.status.toLowerCase() as any} className="scale-90">{bin.fillLevel}% Full</Badge>
                           </div>
                           <p className="text-xs text-gray-500 mt-1 truncate">ID: {bin.householdId}</p>
                           <p className="text-xs text-gray-400">Emptied: {new Date(bin.lastEmptied).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {isCompleted ? (
                               <Badge variant="green" className="py-1 shrink-0"><CheckCircle className="h-3 w-3 mr-1" /> Done</Badge>
                            ) : (
                               <>
                                 <Button size="sm" variant="primary" className="h-8 text-xs shrink-0 shadow-sm" onClick={() => { setSelectedBinId(bin.id); setIsQrModalOpen(true); }}>
                                    <QrCode className="h-3 w-3 mr-1" /> Scan
                                 </Button>
                                 <Button size="sm" variant="outline" className="h-8 text-xs shrink-0 border-gray-200 text-gray-600 bg-white" onClick={() => { setSelectedBinId(bin.id); setIsPhotoModalOpen(true); }}>
                                    <Camera className="h-3 w-3 mr-1" /> Alert
                                 </Button>
                               </>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  );
               })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map visualization */}
      <div className="xl:col-span-2 h-[calc(100vh-8rem)] min-h-[400px]">
        <Card className="glass shadow-lg w-full h-full overflow-hidden border border-white/40">
           <MapContainer 
              center={[13.0827, 80.2707]} 
              zoom={14} 
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%', backgroundColor: '#f0f4f8' }}
              zoomControl={false}
           >
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Polyline positions={routeCoordinates} color="#2563EB" weight={4} opacity={0.6} dashArray="8" />
              
              {routeBins.map(bin => {
                const isCompleted = bin.fillLevel === 0;
                let icon = greenIcon;
                if (!isCompleted) {
                  icon = bin.status === 'Red' ? redIcon : bin.status === 'Yellow' ? yellowIcon : greenIcon;
                }
                
                return (
                  <Marker key={bin.id} position={[bin.location.lat, bin.location.lng]} icon={icon}>
                     <Popup className="rounded-xl overflow-hidden glass mix-blend-normal">
                         <div className="p-1 font-sans">
                            <strong className="block mb-1 text-gray-800">BIN-{bin.id.toUpperCase()}</strong>
                            <Badge variant={isCompleted ? 'green' : bin.status.toLowerCase() as any} className="mb-2 w-max">
                              {isCompleted ? 'Completed' : `${bin.fillLevel}% Full`}
                            </Badge>
                            <div className="text-xs text-gray-600">ID: {bin.householdId}</div>
                         </div>
                     </Popup>
                  </Marker>
                )
              })}
           </MapContainer>
        </Card>
      </div>

      {/* Modals */}
      <Modal isOpen={isQrModalOpen} onClose={() => {setIsQrModalOpen(false); setQrScanningState('idle');}} title="Verify Household QR">
         <div className="flex flex-col items-center justify-center p-4">
            {qrScanningState === 'idle' && (
               <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-inner border border-gray-200">
                  <QrReader
                     onResult={handleScanObject}
                     constraints={{ facingMode: 'environment' }}
                     className="w-full"
                  />
               </div>
            )}
            
            {qrScanningState === 'success' && (
               <motion.div initial={{scale: 0.8, opacity:0}} animate={{scale:1, opacity:1}} className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">Verified & Logged!</h3>
                  <p className="text-gray-500">Points awarded to household.</p>
               </motion.div>
            )}
            <p className="text-sm text-gray-500 mt-6 text-center">Center the QR code in the frame to automatically mark this bin as visited.</p>
         </div>
      </Modal>

      <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Report Bin Overflow">
         <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
               Take a clear photo of the bin. Our AI will automatically verify the fill level and classify the visible waste.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative">
               <input 
                  type="file" 
                  accept="image/*" capture="environment" 
                  onChange={handlePhotoUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  disabled={isAnalyzing}
               />
               <Camera className="h-10 w-10 text-gray-400 mb-2" />
               <p className="text-sm font-medium text-gray-700">Tap to Camera</p>
            </div>

            {isAnalyzing && (
               <div className="p-4 bg-primary/10 text-primary rounded-xl flex items-center justify-center gap-3 animate-pulse text-sm font-semibold border border-primary/20">
                 <Camera className="h-4 w-4 animate-spin" /> Analyzing Photo details via Gemini Vision...
               </div>
            )}

            {visionData && (
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 mt-4">
                 <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Verified Fill Level</p>
                    <p className="text-2xl font-bold text-gray-800">{visionData.fillPercentage ?? 'N/A'}%</p>
                 </div>
                 <div className="w-[1px] bg-gray-200" />
                 <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1"><Recycle className="h-3 w-3"/> Primary Classification</p>
                    <Badge variant={visionData.wasteType === 'Hazardous' ? 'red' : 'blue'} className="mt-1 text-sm">{visionData.wasteType}</Badge>
                 </div>
               </motion.div>
            )}

            {visionData && (
                <Button className="w-full mt-4" onClick={() => setIsPhotoModalOpen(false)}>
                   Submit Report & Alert Officer
                </Button>
            )}
         </div>
      </Modal>
    </div>
  );
}
