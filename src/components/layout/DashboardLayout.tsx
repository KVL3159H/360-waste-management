import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard,
  Map as MapIcon,
  LogOut,
  Menu,
  X,
  Languages,
  User,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export const DashboardLayout = () => {
  const { profile, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Links based on Roles
  const navLinks = [
    { name: 'Dashboard', path: `/${profile?.role}`, icon: LayoutDashboard },
  ];

  if (profile?.role === 'officer' || profile?.role === 'dept') {
    navLinks.push({ name: 'Regional Map', path: `/${profile.role}/map`, icon: MapIcon });
  }
  if (profile?.role === 'admin') {
    navLinks.push({ name: 'Settings', path: '/admin/settings', icon: Settings });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-surface glass md:flex z-10 shadow-lg">
        <div className="flex h-16 shrink-0 items-center px-6">
          <h1 className="text-xl font-bold tracking-tight text-primary">Smart Waste 360</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-gray-900">{profile?.name}</span>
              <span className="truncate text-xs text-gray-500 capitalize">{profile?.role}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-surface/80 glass px-4 md:px-6 z-20">
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="ml-3 text-lg font-semibold text-primary">Smart Waste 360</h1>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-2">
              <Languages className="h-4 w-4" />
              {language === 'en' ? 'தமிழ்' : 'English'}
            </Button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex w-full max-w-xs flex-col bg-surface glass shadow-2xl">
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <span className="text-xl font-bold text-primary">Smart Waste 360</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-grow">
                 {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )
                    }
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </NavLink>
                ))}
              </div>
               <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
               </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
