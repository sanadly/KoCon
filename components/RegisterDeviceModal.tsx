import React, { useState } from 'react';
import { X, QrCode, Smartphone, User, Stethoscope, Save } from 'lucide-react';
import { Patient, DeviceStatus } from '../types';

interface RegisterDeviceModalProps {
  onClose: () => void;
  onRegister: (patient: Patient) => void;
}

export const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    serialId: '',
    name: '',
    age: '',
    condition: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new patient object
    const newPatient: Patient = {
      id: `p-${Math.floor(Math.random() * 10000)}`,
      name: formData.name || 'Anonymous Patient',
      age: Number(formData.age) || 0,
      condition: formData.condition || 'New Therapy',
      device: {
        serialId: formData.serialId || `KOKON-XH-${Math.floor(Math.random() * 9000) + 1000}`,
        batteryLevel: 100,
        medicationLevel: 100,
        lastSync: new Date().toISOString(),
        firmwareVersion: '1.5.0',
        status: DeviceStatus.ONLINE
      },
      config: {
        intervalMinutes: 240, // Default 4 hours
        dailyLimit: 4,
        therapyDurationDays: 14,
        allowedStartTime: '08:00',
        allowedEndTime: '20:00',
        emergencyUnlock: false
      },
      logs: []
    };

    onRegister(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
             <h2 className="text-xl font-bold text-slate-800">Register New Device</h2>
             <p className="text-sm text-slate-500">Pair a new KoKon dispenser (REQ-02)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Device Identification</label>
            <div className="flex gap-2">
               <div className="relative flex-1">
                  <Smartphone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Serial ID (e.g. KOKON-XH-1234)"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono bg-white"
                    value={formData.serialId}
                    onChange={e => setFormData({...formData, serialId: e.target.value})}
                  />
               </div>
               <button type="button" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                 <QrCode className="w-5 h-5" />
                 <span className="hidden sm:inline">Scan</span>
               </button>
            </div>
          </div>

          <div className="space-y-4">
             <label className="block text-sm font-medium text-slate-700">Patient Details (Optional)</label>
             
             <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                   <input 
                      type="number" 
                      placeholder="Age"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                   />
                </div>
                <div className="col-span-2 relative">
                   <Stethoscope className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Condition / Therapy"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      value={formData.condition}
                      onChange={e => setFormData({...formData, condition: e.target.value})}
                   />
                </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              Register Device
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};