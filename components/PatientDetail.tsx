import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Battery, Signal, Fingerprint, Save, RefreshCw, AlertTriangle, Sparkles, Clock, Calendar, ShieldAlert, Smartphone, Droplets 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Patient, DeviceStatus, PrescriptionConfig, MedicationLog } from '../types';
import { analyzePatientData } from '../services/geminiService';
import { PatientAppSimulator } from './PatientAppSimulator';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onUpdateConfig: (patientId: string, newConfig: PrescriptionConfig) => void;
  onAddLog: (patientId: string, log: MedicationLog) => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onUpdateConfig, onAddLog }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONFIG' | 'LOGS'>('OVERVIEW');
  const [config, setConfig] = useState<PrescriptionConfig>(patient.config);
  const [isSaving, setIsSaving] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  // Prepare chart data
  const chartData = patient.logs.reduce((acc: any[], log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      if (log.type === 'DOSE_TAKEN' || log.type === 'EMERGENCY_DOSE') existing.doses += 1;
      if (log.type === 'ATTEMPT_BLOCKED') existing.blocked += 1;
    } else {
      acc.push({
        date,
        doses: (log.type === 'DOSE_TAKEN' || log.type === 'EMERGENCY_DOSE') ? 1 : 0,
        blocked: log.type === 'ATTEMPT_BLOCKED' ? 1 : 0,
      });
    }
    return acc;
  }, []).reverse();

  const handleSaveConfig = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
        onUpdateConfig(patient.id, config);
        setIsSaving(false);
        alert("Configuration queued for sync. Device will update on next connection.");
    }, 1200);
  };

  const handleTrainFingerprint = () => {
      setIsTraining(true);
      setTimeout(() => {
          setIsTraining(false);
          alert("Device is now in Biometric Learning Mode. Please instruct patient to place finger on sensor.");
      }, 2000);
  };

  const generateInsight = async () => {
      setIsLoadingAnalysis(true);
      const result = await analyzePatientData(patient);
      setAiAnalysis(result);
      setIsLoadingAnalysis(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Simulator Overlay */}
      {showSimulator && (
        <PatientAppSimulator 
          patient={patient} 
          onClose={() => setShowSimulator(false)} 
          onAddLog={(log) => onAddLog(patient.id, log)}
        />
      )}

      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
            <p className="text-sm text-slate-500">ID: {patient.id} • Condition: {patient.condition}</p>
        </div>
        <div className="flex items-center space-x-4">
             <button 
                onClick={() => setShowSimulator(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
             >
                <Smartphone className="w-4 h-4" />
                <span>Patient App View</span>
             </button>
             <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <Battery className={`w-4 h-4 ${patient.device.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                <span>{patient.device.batteryLevel}%</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <Droplets className={`w-4 h-4 ${patient.device.medicationLevel < 15 ? 'text-orange-500' : 'text-blue-500'}`} />
                <span>{patient.device.medicationLevel}%</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <Signal className={`w-4 h-4 ${patient.device.status === DeviceStatus.ONLINE ? 'text-blue-500' : 'text-slate-400'}`} />
                <span>{patient.device.status}</span>
             </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
            {['OVERVIEW', 'CONFIG', 'LOGS'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`
                        whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                    `}
                >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
            ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
          {activeTab === 'OVERVIEW' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Adherence History</h3>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorDoses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="doses" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDoses)" name="Doses Taken" />
                                <Area type="monotone" dataKey="blocked" stroke="#ef4444" fill="transparent" strokeDasharray="5 5" name="Blocked Attempts" />
                            </AreaChart>
                        </ResponsiveContainer>
                      </div>
                  </div>

                  {/* AI & Quick Stats */}
                  <div className="space-y-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100">
                          <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-indigo-600" />
                                  KoCon AI Insight
                              </h3>
                              <button 
                                onClick={generateInsight}
                                disabled={isLoadingAnalysis}
                                className="text-xs bg-white text-indigo-600 px-2 py-1 rounded shadow-sm hover:bg-indigo-50 border border-indigo-100 disabled:opacity-50"
                              >
                                {isLoadingAnalysis ? 'Thinking...' : 'Analyze'}
                              </button>
                          </div>
                          <p className="text-sm text-indigo-800 leading-relaxed">
                             {aiAnalysis || "Click 'Analyze' to generate an AI-powered assessment of patient compliance based on recent log data."}
                          </p>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="font-semibold text-slate-800 mb-4">Device Controls</h3>
                          <button 
                             onClick={handleTrainFingerprint}
                             disabled={isTraining}
                             className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg transition-colors mb-3"
                          >
                              {isTraining ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                  <Fingerprint className="w-4 h-4" />
                              )}
                              <span>{isTraining ? 'Syncing...' : 'Enroll Biometrics'}</span>
                          </button>
                          <div className="text-xs text-slate-500 text-center">
                              Firmware v{patient.device.firmwareVersion} • Serial {patient.device.serialId}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'CONFIG' && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-3xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Prescription Settings</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Last Synced: {new Date(patient.device.lastSync).toLocaleString()}
                      </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Interval */}
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              Minimum Interval (Minutes)
                          </label>
                          <input 
                              type="number" 
                              value={config.intervalMinutes}
                              onChange={(e) => setConfig({...config, intervalMinutes: Number(e.target.value)})}
                              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                          />
                          <p className="text-xs text-slate-500">Wait time between doses.</p>
                      </div>

                      {/* Daily Limit */}
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-slate-400" />
                              Daily Limit (Doses)
                          </label>
                          <input 
                              type="number" 
                              value={config.dailyLimit}
                              onChange={(e) => setConfig({...config, dailyLimit: Number(e.target.value)})}
                              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                          />
                      </div>

                       {/* Time Window */}
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              Active Hours
                          </label>
                          <div className="flex items-center gap-2">
                              <input 
                                  type="time" 
                                  value={config.allowedStartTime}
                                  onChange={(e) => setConfig({...config, allowedStartTime: e.target.value})}
                                  className="w-full p-3 border border-slate-200 rounded-lg bg-white"
                              />
                              <span className="text-slate-400">to</span>
                              <input 
                                  type="time" 
                                  value={config.allowedEndTime}
                                  onChange={(e) => setConfig({...config, allowedEndTime: e.target.value})}
                                  className="w-full p-3 border border-slate-200 rounded-lg bg-white"
                              />
                          </div>
                      </div>

                      {/* Duration */}
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Therapy Duration (Days)</label>
                          <input 
                              type="number" 
                              value={config.therapyDurationDays}
                              onChange={(e) => setConfig({...config, therapyDurationDays: Number(e.target.value)})}
                              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                          />
                      </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                           <div className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${config.emergencyUnlock ? 'bg-orange-500' : 'bg-slate-300'}`} onClick={() => setConfig({...config, emergencyUnlock: !config.emergencyUnlock})}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${config.emergencyUnlock ? 'translate-x-4' : 'translate-x-0'}`}></div>
                           </div>
                           <span className="text-sm font-medium text-slate-700">Emergency Manual Unlock Allowed</span>
                       </div>

                       <button 
                          onClick={handleSaveConfig}
                          disabled={isSaving}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all shadow-md disabled:opacity-70"
                       >
                           {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           <span>Sync to Device</span>
                       </button>
                  </div>
              </div>
          )}

          {activeTab === 'LOGS' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                          <tr>
                              <th className="px-6 py-4">Timestamp</th>
                              <th className="px-6 py-4">Event Type</th>
                              <th className="px-6 py-4">Details</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {patient.logs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 text-sm text-slate-600">
                                      {new Date(log.timestamp).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          log.type === 'DOSE_TAKEN' 
                                            ? 'bg-green-100 text-green-800'
                                            : log.type === 'EMERGENCY_DOSE'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-red-100 text-red-800'
                                      }`}>
                                          {log.type === 'DOSE_TAKEN' 
                                            ? 'Dose Administered' 
                                            : log.type === 'EMERGENCY_DOSE'
                                            ? 'Emergency Override'
                                            : 'Access Denied'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-slate-500">
                                      {log.note || '-'}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>
    </div>
  );
};