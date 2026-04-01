import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAppData } from '../../hooks/useAppData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MapIcon, AlertTriangle, CheckCircle, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Leaflet icon setup omitted here for brevity since it's same as collector, but we'll import default marker
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],iconAnchor: [12, 41],popupAnchor: [1, -34],shadowSize: [41, 41]
});
const yellowIcon = new L.Icon({ ...redIcon.options, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png' });
const greenIcon = new L.Icon({ ...redIcon.options, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' });


export default function OfficerDashboard() {
  const { bins, loading } = useAppData();

  if (loading) return <div>Loading Region Data...</div>;

  const redBins = bins.filter(b => b.status === 'Red');
  const criticalCount = redBins.length;

  const performanceData = [
    { name: 'Mon', completed: 120, missed: 4 },
    { name: 'Tue', completed: 132, missed: 2 },
    { name: 'Wed', completed: 101, missed: 5 },
    { name: 'Thu', completed: 140, missed: 0 },
    { name: 'Fri', completed: 150, missed: 1 },
    { name: 'Sat', completed: 90, missed: 8 },
    { name: 'Sun', completed: 85, missed: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Zone Overview</h2>
          <p className="text-gray-500">North District Command Center</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-gray-200">
             <Users className="h-4 w-4 mr-2" /> Assign Routes
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="glass pointer-events-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-red-500"/> Critical Bins</CardDescription>
              <CardTitle className="text-3xl text-red-600">{criticalCount}</CardTitle>
            </CardHeader>
         </Card>
         <Card className="glass pointer-events-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500"/> Safe Bins</CardDescription>
              <CardTitle className="text-3xl text-gray-800">{bins.length - criticalCount}</CardTitle>
            </CardHeader>
         </Card>
         <Card className="glass pointer-events-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-500"/> Active Collectors</CardDescription>
              <CardTitle className="text-3xl text-gray-800">24</CardTitle>
            </CardHeader>
         </Card>
         <Card className="glass pointer-events-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold flex items-center gap-1.5"><Activity className="h-4 w-4 text-orange-500"/> Zone Efficiency</CardDescription>
              <CardTitle className="text-3xl text-gray-800">92%</CardTitle>
            </CardHeader>
         </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[500px]">
        {/* Map */}
        <Card className="glass shadow-lg flex flex-col h-full border border-white/40">
           <CardHeader className="pb-3 flex-shrink-0 bg-white/40 border-b border-gray-100/50">
             <CardTitle className="flex items-center gap-2 text-lg"><MapIcon className="h-5 w-5 text-gray-700"/> Jurisdiction Map</CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-1 relative z-0">
              <MapContainer 
                center={[13.0837, 80.2707]} 
                zoom={14} 
                style={{ height: '100%', width: '100%', backgroundColor: '#f0f4f8' }}
              >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  {bins.map(bin => {
                    const icon = bin.status === 'Red' ? redIcon : bin.status === 'Yellow' ? yellowIcon : greenIcon;
                    return (
                      <Marker key={bin.id} position={[bin.location.lat, bin.location.lng]} icon={icon}>
                         <Popup>
                           <strong>BIN-{bin.id.toUpperCase()}</strong><br/>
                           Fill: {bin.fillLevel}%<br/>
                           Status: {bin.status}
                         </Popup>
                      </Marker>
                    )
                  })}
              </MapContainer>
           </CardContent>
        </Card>

        {/* Charts & Table */}
        <div className="flex flex-col gap-6 h-full">
           <Card className="glass shadow-lg flex-1 min-h-[220px]">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm">Collector Performance (Week)</CardTitle>
             </CardHeader>
             <CardContent className="h-full pt-2">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="missed" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>

           <Card className="glass shadow-lg flex-1 min-h-[220px] overflow-hidden flex flex-col">
             <CardHeader className="pb-2 flex-shrink-0 bg-white/40 border-b border-gray-100/50">
                <CardTitle className="text-sm flex items-center justify-between">
                  Bin Alerts Table 
                  <Badge variant="red">{redBins.length} Action Needed</Badge>
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Household</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Level</th>
                      <th className="px-4 py-3 font-medium text-gray-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {bins.filter(b => b.fillLevel > 50).sort((a,b)=> b.fillLevel - a.fillLevel).map(bin => (
                      <motion.tr key={bin.id} initial={{opacity:0}} animate={{opacity:1}} className="hover:bg-white/40 cursor-pointer">
                         <td className="px-4 py-3 font-medium text-gray-900 border-none">BIN-{bin.id}</td>
                         <td className="px-4 py-3 text-gray-500">{bin.householdId}</td>
                         <td className="px-4 py-3">
                            <Badge variant={bin.status.toLowerCase() as any} className="w-max">{bin.fillLevel}%</Badge>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <Button size="sm" variant={bin.status === 'Red' ? 'destructive' : 'outline'} className="h-7 text-xs px-2 py-0">Dispatch</Button>
                         </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
