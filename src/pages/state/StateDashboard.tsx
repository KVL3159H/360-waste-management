import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAppData } from '../../hooks/useAppData';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Building2, TrendingUp, BarChart2, ShieldCheck, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StateDashboard() {
  const { districts, loading } = useAppData();

  if (loading) return <div>Loading State Data...</div>;

  const totalHouseholds = districts.reduce((acc, curr) => acc + curr.activeHouseholds, 0);
  const totalStateWaste = districts.reduce((acc, curr) => acc + curr.totalWaste, 0);
  const avgSegregation = districts.reduce((acc, curr) => acc + curr.avgSegregationScore, 0) / districts.length;

  const trendData = [
    { month: 'Jan', organic: 3400, recyclable: 2800, mixed: 1200 },
    { month: 'Feb', organic: 3600, recyclable: 3100, mixed: 1000 },
    { month: 'Mar', organic: 4000, recyclable: 3500, mixed: 800 },
    { month: 'Apr', organic: 4500, recyclable: 3900, mixed: 750 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-gray-900">State Analytics</h2>
           <p className="text-gray-500">Department of Environment & Sanitation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3}}>
            <Card className="glass pointer-events-none text-center h-full">
              <CardContent className="pt-6">
                 <div className="h-12 w-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                 </div>
                 <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Households</p>
                 <h3 className="text-4xl font-bold text-gray-900 mt-2">{totalHouseholds.toLocaleString()}</h3>
              </CardContent>
            </Card>
         </motion.div>
         <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.1}}>
            <Card className="glass pointer-events-none text-center h-full">
              <CardContent className="pt-6">
                 <div className="h-12 w-12 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                 </div>
                 <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">State Waste Volume</p>
                 <h3 className="text-4xl font-bold text-gray-900 mt-2">{(totalStateWaste/1000).toFixed(1)} <span className="text-2xl">Tons</span></h3>
              </CardContent>
            </Card>
         </motion.div>
         <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3, delay:0.2}}>
            <Card className="glass pointer-events-none text-center h-full">
              <CardContent className="pt-6">
                 <div className="h-12 w-12 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-indigo-600" />
                 </div>
                 <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg Segregation</p>
                 <h3 className="text-4xl font-bold text-gray-900 mt-2">{avgSegregation.toFixed(1)}%</h3>
              </CardContent>
            </Card>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[400px]">
         {/* District Comparison Bar Chart */}
         <Card className="glass shadow-lg flex flex-col h-full">
            <CardHeader className="pb-2 border-b border-gray-100/50 bg-white/40">
               <CardTitle className="flex items-center gap-2 text-lg"><BarChart2 className="h-5 w-5 text-gray-700"/> District Segregation Compliance</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={districts} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="district" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#374151', fontWeight: 500 }} width={120} />
                    <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="avgSegregationScore" fill="#3B82F6" radius={[0, 8, 8, 0]} barSize={24} name="Compliance %"/>
                 </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* 4 Month Trend Line Chart */}
         <Card className="glass shadow-lg flex flex-col h-full">
            <CardHeader className="pb-2 border-b border-gray-100/50 bg-white/40">
               <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-gray-700"/> Waste Composition Trend (kg)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                   <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Legend verticalAlign="top" height={36} iconType="circle" />
                   <Line type="monotone" dataKey="organic" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Organic" />
                   <Line type="monotone" dataKey="recyclable" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Recyclable" />
                   <Line type="monotone" dataKey="mixed" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Mixed (Penalty)" />
                 </LineChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>

      {/* Heatmap Area Simulation */}
      <Card className="glass shadow-lg flex flex-col h-[500px] border border-white/40 overflow-hidden">
         <CardHeader className="pb-3 border-b border-gray-100/50 bg-white/40 z-10">
            <CardTitle className="flex items-center gap-2 text-lg">
               <MapIcon className="h-5 w-5 text-gray-700"/>
               Statewide Generation Heatmap
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
               Intensity indicates aggregate waste tonnage per zone
               <div className="flex bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 h-2 w-32 rounded-full border border-gray-200" />
            </CardDescription>
         </CardHeader>
         <CardContent className="p-0 flex-1 relative z-0">
            <MapContainer 
               center={[13.04, 80.20]} // Center around Chennai wide
               zoom={11} 
               style={{ height: '100%', width: '100%', backgroundColor: '#f0f4f8' }}
            >
               <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
               
               {/* Simulating heatmap via layered gradient circles */}
               <Circle center={[13.0827, 80.2707]} pathOptions={{ fillColor: 'red', color: 'transparent', fillOpacity: 0.4 }} radius={3000} />
               <Circle center={[13.0827, 80.2707]} pathOptions={{ fillColor: 'yellow', color: 'transparent', fillOpacity: 0.5 }} radius={1500} />
               
               <Circle center={[12.9716, 80.2464]} pathOptions={{ fillColor: 'blue', color: 'transparent', fillOpacity: 0.4 }} radius={4000} />
               <Circle center={[12.9716, 80.2464]} pathOptions={{ fillColor: 'green', color: 'transparent', fillOpacity: 0.5 }} radius={2000} />
               
               <Circle center={[13.1118, 80.1984]} pathOptions={{ fillColor: 'red', color: 'transparent', fillOpacity: 0.3 }} radius={5000} />
               <Circle center={[13.1118, 80.1984]} pathOptions={{ fillColor: 'orange', color: 'transparent', fillOpacity: 0.5 }} radius={2500} />
               <Circle center={[13.1118, 80.1984]} pathOptions={{ fillColor: 'yellow', color: 'transparent', fillOpacity: 0.7 }} radius={1000} />
            </MapContainer>
         </CardContent>
      </Card>
      
    </div>
  );
}
