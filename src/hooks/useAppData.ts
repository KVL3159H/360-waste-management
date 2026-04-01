import { useState, useEffect } from 'react';
/* 
In a real production environment, you would use:
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
*/

// Types
export type BinStatus = 'Green' | 'Yellow' | 'Red';
export type WasteType = 'Organic' | 'Recyclable' | 'Hazardous' | 'Mixed';

export interface Bin {
  id: string;
  householdId: string;
  location: { lat: number; lng: number };
  status: BinStatus;
  fillLevel: number; // 0 - 100
  lastEmptied: string;
}

export interface WasteLog {
  id: string;
  householdId: string;
  type: WasteType;
  weightKg: number;
  pointsAwarded: number;
  date: string;
}

export interface CollectorRoute {
  id: string;
  collectorId: string;
  date: string;
  binsToCollect: string[]; 
  completedBins: string[];
}

export interface DistrictStat {
  district: string;
  totalWaste: number;
  avgSegregationScore: number;
  activeHouseholds: number;
}

// Mock Data
const MOCK_BINS: Bin[] = [
  { id: 'b1', householdId: 'h1', location: { lat: 13.0827, lng: 80.2707 }, status: 'Red', fillLevel: 95, lastEmptied: '2023-10-25T10:00:00Z' },
  { id: 'b2', householdId: 'h2', location: { lat: 13.0830, lng: 80.2710 }, status: 'Yellow', fillLevel: 60, lastEmptied: '2023-10-26T14:30:00Z' },
  { id: 'b3', householdId: 'h3', location: { lat: 13.0815, lng: 80.2725 }, status: 'Green', fillLevel: 20, lastEmptied: '2023-10-28T09:15:00Z' },
  { id: 'b4', householdId: 'h4', location: { lat: 13.0845, lng: 80.2690 }, status: 'Red', fillLevel: 100, lastEmptied: '2023-10-24T11:00:00Z' },
  { id: 'b5', householdId: 'h5', location: { lat: 13.0850, lng: 80.2750 }, status: 'Yellow', fillLevel: 75, lastEmptied: '2023-10-26T16:20:00Z' },
];

const MOCK_LOGS: WasteLog[] = [
  { id: 'l1', householdId: 'h1', type: 'Organic', weightKg: 2.5, pointsAwarded: 25, date: '2023-10-28T10:30:00Z' },
  { id: 'l2', householdId: 'h1', type: 'Recyclable', weightKg: 1.2, pointsAwarded: 36, date: '2023-10-26T09:15:00Z' },
  { id: 'l3', householdId: 'h1', type: 'Mixed', weightKg: 3.0, pointsAwarded: 10, date: '2023-10-24T14:20:00Z' },
];

const MOCK_ROUTES: CollectorRoute[] = [
  { id: 'r1', collectorId: 'c1', date: new Date().toISOString().split('T')[0], binsToCollect: ['b1', 'b2', 'b4', 'b5'], completedBins: ['b2'] }
];

const MOCK_DISTRICTS: DistrictStat[] = [
  { district: 'Chennai North', totalWaste: 4500, avgSegregationScore: 78, activeHouseholds: 12500 },
  { district: 'Chennai Central', totalWaste: 6200, avgSegregationScore: 85, activeHouseholds: 18000 },
  { district: 'Chennai South', totalWaste: 5100, avgSegregationScore: 92, activeHouseholds: 15400 },
];

export const useAppData = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [logs, setLogs] = useState<WasteLog[]>([]);
  const [routes, setRoutes] = useState<CollectorRoute[]>([]);
  const [districts, setDistricts] = useState<DistrictStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this is where Firestore onSnapshot listeners reside.
    // For this implementation, we simulate real-time data loading.
    const loadData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBins(MOCK_BINS);
      setLogs(MOCK_LOGS);
      setRoutes(MOCK_ROUTES);
      setDistricts(MOCK_DISTRICTS);
      setLoading(false);
    };

    loadData();
    
    // Simulate real-time updates every 30 seconds (for demo polish)
    const interval = setInterval(() => {
       setBins(prev => prev.map(b => {
           if(b.status === 'Green' && Math.random() > 0.8) return {...b, fillLevel: b.fillLevel + 10, status: b.fillLevel > 50 ? 'Yellow' : 'Green'};
           return b;
       }));
    }, 30000);
    
    return () => clearInterval(interval);

  }, []);

  return { bins, logs, routes, districts, loading, setBins, setLogs };
};
