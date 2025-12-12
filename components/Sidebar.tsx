import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Activity } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onSignOut }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'PATIENTS', label: 'Patients', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <div className="bg-blue-500 p-2 rounded-lg">
           <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">KoCon</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
        
        <button
           onClick={() => onChangeView('SETTINGS')}
           className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
             currentView === 'SETTINGS'
               ? 'bg-blue-600 text-white shadow-md'
               : 'text-slate-400 hover:bg-slate-800 hover:text-white'
           }`}
        >
           <Settings className="w-5 h-5" />
           <span className="font-medium">Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={onSignOut}
          className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        <div className="mt-4 text-xs text-slate-600">
            v1.2.0 • Build 8842
        </div>
      </div>
    </div>
  );
};