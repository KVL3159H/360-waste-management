import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAppData } from '../../hooks/useAppData';
import { motion } from 'framer-motion';
import { Users, LayoutGrid, Box, Award, ShieldAlert, Plus, Edit, Trash2, Search, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { bins, logs } = useAppData();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  // Aggregate Metrics Mock
  const totalWaste = logs.reduce((sum, log) => sum + log.weightKg, 0);
  const totalPoints = logs.reduce((sum, log) => sum + log.pointsAwarded, 0);
  const totalUsers = 4850;
  
  const activeCollectors = 45;
  const activeOfficers = 12;

  // Mock User List for CRUD demo
  const [mockUsers, setMockUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'household', zone: 'North' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'collector', zone: 'South' },
    { id: '3', name: 'Ravi Teja', email: 'ravi@gov.in', role: 'officer', zone: 'Central' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-gray-900">Platform Administration</h2>
           <p className="text-gray-500">System Management & Global Configurations</p>
        </div>
        <Button onClick={() => setIsUserModalOpen(true)} className="gap-2 shadow-md">
           <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}}>
            <Card className="glass pointer-events-none">
              <CardHeader className="pb-2">
                 <CardDescription className="text-sm font-semibold flex items-center gap-2"><LayoutGrid className="h-4 w-4 text-primary"/> Total Users</CardDescription>
                 <CardTitle className="text-3xl text-gray-800">{totalUsers.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
         </motion.div>
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
            <Card className="glass pointer-events-none">
              <CardHeader className="pb-2">
                 <CardDescription className="text-sm font-semibold flex items-center gap-2"><Box className="h-4 w-4 text-green-500"/> Total Waste Collected</CardDescription>
                 <CardTitle className="text-3xl text-gray-800">{totalWaste.toFixed(2)}kg</CardTitle>
              </CardHeader>
            </Card>
         </motion.div>
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}}>
            <Card className="glass pointer-events-none">
              <CardHeader className="pb-2">
                 <CardDescription className="text-sm font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-orange-500"/> Points Awarded</CardDescription>
                 <CardTitle className="text-3xl text-gray-800">{totalPoints.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
         </motion.div>
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}}>
            <Card className="glass pointer-events-none">
              <CardHeader className="pb-2">
                 <CardDescription className="text-sm font-semibold flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500"/> Active Bins</CardDescription>
                 <CardTitle className="text-3xl text-gray-800">{bins.length * 125}</CardTitle>
              </CardHeader>
            </Card>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Users Table */}
         <Card className="glass shadow-lg col-span-2 flex flex-col min-h-[500px]">
            <CardHeader className="pb-3 border-b border-gray-100/50 flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-gray-700"/> User Management</CardTitle>
              </div>
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <Input className="pl-9 h-9" placeholder="Search users by name or email" />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100/50">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Zone</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                     {mockUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/40 transition-colors">
                           <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                           <td className="px-6 py-4 text-gray-500">{user.email}</td>
                           <td className="px-6 py-4">
                              <Badge variant={user.role === 'admin' ? 'red' : user.role === 'officer' ? 'blue' : user.role === 'collector' ? 'green' : 'gray'}>
                                 {user.role}
                              </Badge>
                           </td>
                           <td className="px-6 py-4 text-gray-500">{user.zone}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Edit className="h-4 w-4"/></Button>
                                 <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => setMockUsers(prev => prev.filter(u=>u.id!==user.id))}><Trash2 className="h-4 w-4"/></Button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </CardContent>
         </Card>

         {/* Configuration Sidebar */}
         <div className="space-y-6">
            <Card className="glass shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] pointer-events-none" />
               <CardHeader className="border-b border-gray-100/50 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5 text-gray-700"/> Gamification Rules</CardTitle>
                  <CardDescription>Configure reward points allocation</CardDescription>
               </CardHeader>
               <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1 z-10 relative">
                     <label className="text-sm font-medium text-gray-700">Organic Waste (Pts/kg)</label>
                     <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-1 z-10 relative">
                     <label className="text-sm font-medium text-gray-700">Recyclable Waste (Pts/kg)</label>
                     <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-1 z-10 relative">
                     <label className="text-sm font-medium text-gray-700">Mixed Waste Penalty (Pts/kg)</label>
                     <Input type="number" defaultValue="-5" />
                  </div>
                  <Button className="w-full mt-4">Save Configuration</Button>
               </CardContent>
            </Card>
            
            <Card className="glass shadow-lg">
               <CardHeader className="pb-3 text-center">
                  <CardTitle className="text-md">System Health</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div className="flex justify-between items-center bg-green-50/50 p-2 rounded-lg border border-green-100">
                     <span className="text-sm font-medium text-green-800">Firestore Read Rate</span>
                     <Badge variant="green">Normal</Badge>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                     <span className="text-sm font-medium text-blue-800">Gemini Vision AI</span>
                     <Badge variant="blue">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg border border-gray-200">
                     <span className="text-sm font-medium text-gray-800">Auth Service</span>
                     <Badge variant="gray">Operational</Badge>
                  </div>
               </CardContent>
            </Card>
         </div>
         
      </div>

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Add New User">
         <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsUserModalOpen(false); }}>
            <Input label="Full Name" placeholder="E.g. Alex Doe" required />
            <Input label="Email address" type="email" placeholder="alex@example.com" required />
            <div className="space-y-1">
               <label className="text-sm font-medium text-gray-700">Role</label>
               <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="household">Household</option>
                  <option value="collector">Collector</option>
                  <option value="officer">Zone Officer</option>
                  <option value="admin">Administrator</option>
                  <option value="dept">State Department</option>
               </select>
            </div>
            <Input label="Initial Zone / Region" placeholder="North Zone" />
            <div className="pt-4 flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
               <Button type="submit">Create User</Button>
            </div>
         </form>
      </Modal>

    </div>
  );
}
