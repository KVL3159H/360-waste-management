import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type Role = 'household' | 'collector' | 'officer' | 'admin' | 'dept';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: Role;
  name: string;
  zone?: string;
  points?: number;
}

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => void;
  __dev_setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Hardcoded mock user for UI testing during early development
  const MOCK_MODE = true;

  const [user, setUser] = useState<User | null>(MOCK_MODE ? { uid: 'mock-user' } as unknown as User : null);
  const [profile, setProfile] = useState<UserProfile | null>(MOCK_MODE ? {
    uid: 'mock-user',
    email: 'household@test.com',
    role: 'household',
    name: 'Household Demo',
    points: 1500,
    zone: 'North Zone'
  } : null);
  const [loading, setLoading] = useState(MOCK_MODE ? false : true);

  useEffect(() => {
    if (MOCK_MODE) return;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            role: 'household', // Default fallback
            name: currentUser.displayName || 'User',
            points: 0
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [MOCK_MODE]);

  const logout = () => {
    if (MOCK_MODE) {
      setUser(null);
      setProfile(null);
      return;
    }
    auth.signOut();
  };

  /**
   * Helper function for UI Dev - allows switching roles dynamically on the client
   */
  const __dev_setRole = (role: Role) => {
    if (profile) setProfile({ ...profile, role });
  };

  return (
    // @ts-ignore - exporting internal setter for quick dev switcher
    <AuthContext.Provider value={{ user, profile, loading, logout, __dev_setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
