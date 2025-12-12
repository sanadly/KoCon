import React, { useState } from 'react';
import { Save, User, Bell, Globe, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. Anderson',
    email: 'dr.anderson@kocon.med',
    specialty: 'Pain Management'
  });

  const [notifications, setNotifications] = useState({
    lowBattery: true,
    missedDose: true,
    deviceOffline: true,
    weeklyReport: false
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your account and application preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                    type="text" 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                    type="email" 
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Medical Specialty</label>
                <input 
                    type="text" 
                    value={profile.specialty}
                    onChange={e => setProfile({...profile, specialty: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
            </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
            {[
                { key: 'lowBattery', label: 'Low Battery Alerts', desc: 'Notify when device battery drops below 20%' },
                { key: 'missedDose', label: 'Missed Dose Alerts', desc: 'Notify when a patient misses a scheduled dose' },
                { key: 'deviceOffline', label: 'Device Offline Alerts', desc: 'Notify when a device hasn\'t synced for 24 hours' },
                { key: 'weeklyReport', label: 'Weekly Summary Emails', desc: 'Receive a weekly PDF summary of all patient activities' },
            ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-700">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={(notifications as any)[item.key]}
                            onChange={() => setNotifications({...notifications, [item.key]: !(notifications as any)[item.key]})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
        </div>
      </div>

       {/* System Section */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">System Preferences</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Language</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    <option>English (US)</option>
                    <option>German (Deutsch)</option>
                    <option>French (Français)</option>
                </select>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Time Zone</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    <option>Central European Time (CET)</option>
                    <option>Pacific Time (PT)</option>
                    <option>UTC</option>
                </select>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-all active:scale-95 ${
                saved 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>

    </div>
  );
};