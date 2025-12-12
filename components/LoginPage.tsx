import React from 'react';
import { User, Stethoscope, Activity, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
           <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">KoCon</h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">Smart Medication Dispensing Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Doctor Card */}
        <button 
          onClick={() => onLogin('DOCTOR')}
          className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 p-8 rounded-2xl transition-all duration-300 text-left flex flex-col h-64 hover:shadow-2xl hover:shadow-blue-900/20"
        >
          <div className="absolute top-6 right-6 p-2 bg-slate-700 rounded-full group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
          </div>
          
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
            <Stethoscope className="w-6 h-6 text-indigo-400" />
          </div>
          
          <div className="mt-auto">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Doctor Portal</h2>
            <p className="text-slate-400 text-sm">Access patient dashboards, configure devices, and analyze compliance data.</p>
          </div>
        </button>

        {/* Patient Card */}
        <button 
          onClick={() => onLogin('PATIENT')}
          className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 p-8 rounded-2xl transition-all duration-300 text-left flex flex-col h-64 hover:shadow-2xl hover:shadow-emerald-900/20"
        >
           <div className="absolute top-6 right-6 p-2 bg-slate-700 rounded-full group-hover:bg-emerald-600/20 group-hover:text-emerald-400 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
          </div>

          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          
          <div className="mt-auto">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Patient App</h2>
            <p className="text-slate-400 text-sm">Simulate the mobile experience for patients. View next dose time and status.</p>
          </div>
        </button>

      </div>

      <div className="mt-16 text-slate-600 text-sm">
        &copy; 2024 KoCon Medical Systems. Demo Build.
      </div>
    </div>
  );
};