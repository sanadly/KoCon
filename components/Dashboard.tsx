import React from 'react';
import { Users, BatteryWarning, WifiOff, BellRing, Droplets } from 'lucide-react';
import { Patient, DeviceStatus } from '../types';

interface DashboardProps {
  patients: Patient[];
}

export const Dashboard: React.FC<DashboardProps> = ({ patients }) => {
  const totalPatients = patients.length;
  const offlineDevices = patients.filter(p => p.device.status === DeviceStatus.OFFLINE).length;
  const lowBatteryDevices = patients.filter(p => p.device.batteryLevel < 20).length;
  const lowMedicationDevices = patients.filter(p => p.device.medicationLevel < 15).length;
  const warnings = patients.reduce((acc, p) => {
      const blockedAttempts = p.logs.filter(l => l.type === 'ATTEMPT_BLOCKED').length;
      return acc + (blockedAttempts > 5 ? 1 : 0); // Arbitrary threshold
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Practice Overview</h1>
        <p className="text-slate-500">Welcome back, Dr. Anderson.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Therapies</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalPatients}</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Offline Devices</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{offlineDevices}</h3>
          </div>
          <div className={`p-3 rounded-lg ${offlineDevices > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
            <WifiOff className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Low Battery</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{lowBatteryDevices}</h3>
          </div>
          <div className={`p-3 rounded-lg ${lowBatteryDevices > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
            <BatteryWarning className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Low Medication</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{lowMedicationDevices}</h3>
          </div>
          <div className={`p-3 rounded-lg ${lowMedicationDevices > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Usage Anomalies</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{warnings}</h3>
          </div>
          <div className={`p-3 rounded-lg ${warnings > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
            <BellRing className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">System Alerts & Notifications</h3>
        </div>
        <div className="divide-y divide-slate-100">
            {lowMedicationDevices > 0 && patients.filter(p => p.device.medicationLevel < 15).map(p => (
                <div key={p.id + 'med'} className="p-4 flex items-center space-x-4 hover:bg-slate-50">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Low Medication Level ({p.device.medicationLevel}%)</p>
                        <p className="text-xs text-slate-500">Patient: {p.name} • Device: {p.device.serialId}</p>
                    </div>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">View</button>
                </div>
            ))}
            {lowBatteryDevices > 0 && patients.filter(p => p.device.batteryLevel < 20).map(p => (
                <div key={p.id + 'bat'} className="p-4 flex items-center space-x-4 hover:bg-slate-50">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Low Battery Warning ({p.device.batteryLevel}%)</p>
                        <p className="text-xs text-slate-500">Patient: {p.name} • Device: {p.device.serialId}</p>
                    </div>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">View</button>
                </div>
            ))}
             {offlineDevices > 0 && patients.filter(p => p.device.status === DeviceStatus.OFFLINE).map(p => (
                <div key={p.id + 'off'} className="p-4 flex items-center space-x-4 hover:bg-slate-50">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Device Offline</p>
                        <p className="text-xs text-slate-500">Patient: {p.name} • Last Sync: {new Date(p.device.lastSync).toLocaleDateString()}</p>
                    </div>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">View</button>
                </div>
            ))}
             {lowBatteryDevices === 0 && offlineDevices === 0 && lowMedicationDevices === 0 && (
                 <div className="p-8 text-center text-slate-500">
                     No active alerts. All systems operational.
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};