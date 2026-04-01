import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../hooks/useAppData';
import { getGeminiChatResponse } from '../../lib/gemini';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Recycle, ArrowRight, TrendingUp, Calendar, Gift, MessageCircle, Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function HouseholdDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { logs, bins, loading } = useAppData();
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Derive stats
  const totalWaste = logs.reduce((sum, log) => sum + log.weightKg, 0);
  const nextPickup = new Date(); 
  nextPickup.setDate(nextPickup.getDate() + 2); // Mock
  
  const userBin = bins.find(b => b.householdId === profile?.uid) || bins[0]; // fallback to first mock bin

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    const contextData = `User: ${profile?.name}, Total Waste: ${totalWaste}kg, Points: ${profile?.points}, Current Bin Status: ${userBin?.status} (${userBin?.fillLevel}% full).`;
    const aiResponse = await getGeminiChatResponse(userMsg, contextData);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsChatLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Waste</p>
                <p className="text-2xl font-bold text-gray-900">{totalWaste.toFixed(2)} kg</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Reward Points</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.points || 0}</p>
                <div className="mt-1">
                   <Button variant="outline" size="sm" className="h-6 text-xs px-2 py-0 border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100">Redeem</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Next Pickup</p>
                <p className="text-lg font-bold text-gray-900">
                  {format(nextPickup, 'MMM dd, yyyy')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="glass overflow-hidden shadow-lg border-t-4 border-t-primary">
            <CardHeader className="bg-white/50 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-gray-700" />
                  Smart Bin Status
                </CardTitle>
                <CardDescription>Real-time analytics for your designated bin</CardDescription>
              </div>
              <Badge variant={userBin?.status.toLowerCase() as any} className="text-sm px-3 py-1 scale-110">
                {userBin?.status} ({userBin?.fillLevel}%)
              </Badge>
            </CardHeader>
            <CardContent className="pt-6 relative">
               <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${userBin?.fillLevel}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${userBin?.status === 'Green' ? 'bg-green-500' : userBin?.status === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  />
                  <div className="absolute inset-0 flex justify-between px-3 items-center text-xs font-semibold mix-blend-difference text-white/70">
                    <span>Empty</span>
                    <span>Full</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="glass shadow-lg">
            <CardHeader className="border-b border-gray-100/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Recycle className="h-5 w-5 text-gray-700" />
                Recent Waste Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <ul className="divide-y divide-gray-100/50">
                  {logs.slice(0, 5).map(log => (
                    <li key={log.id} className="p-4 hover:bg-white/40 transition-colors flex items-center justify-between">
                       <div className="flex flex-col">
                         <span className="font-semibold text-gray-800">{log.type} Waste</span>
                         <span className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</span>
                       </div>
                       <div className="flex items-center gap-4 text-sm">
                         <span className="font-medium">{log.weightKg} kg</span>
                         <Badge variant="green">+{log.pointsAwarded} pts</Badge>
                       </div>
                    </li>
                  ))}
                  {logs.length === 0 && <li className="p-6 text-center text-gray-500">No recent logs found.</li>}
               </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - QR & AI Chat */}
        <div className="space-y-6">
          <Card className="glass shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none" />
            <CardHeader className="text-center pb-2">
               <CardTitle className="text-lg">Household QR</CardTitle>
               <CardDescription>Show this to the collector</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
               <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                <QRCodeSVG value={profile?.uid || 'anonymous'} size={150} level="H" includeMargin={true} />
               </div>
               <p className="mt-4 text-xs font-mono text-gray-400">ID: {profile?.uid}</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-lg flex flex-col h-[400px]">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100/50 pb-3">
              <CardTitle className="flex items-center gap-2 text-[1.1rem]">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                  <MessageCircle className="h-4 w-4" />
                </div>
                EcoAssistant AI
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 space-y-2">
              <div className="bg-gray-100/80 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 self-start shadow-sm border border-gray-50">
                Hi {profile?.name}! Ask me how you can safely dispose of specific items or optimize your {totalWaste}kg profile!
              </div>
              {messages.map((msg, idx) => (
                <div key={idx} className={`p-3 text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-white rounded-2xl rounded-tr-sm self-end' : 'bg-gray-100/80 text-gray-800 rounded-2xl rounded-tl-sm self-start border border-gray-50'}`}>
                  {msg.text}
                </div>
              ))}
              {isChatLoading && (
                <div className="bg-gray-100/80 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 self-start animate-pulse">
                  Thinking...
                </div>
              )}
            </CardContent>
            <div className="p-3 border-t border-gray-100/50 bg-white/30">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <Input 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="h-10 border-gray-200"
                />
                <Button type="submit" size="icon" disabled={isChatLoading || !chatInput} className="shrink-0 h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
}
