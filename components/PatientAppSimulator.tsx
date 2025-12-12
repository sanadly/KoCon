import React, { useState, useEffect } from 'react';
import { X, Phone, History, CheckCircle, Lock, LogOut, SprayCan, AlertCircle, Droplets } from 'lucide-react';
import { Patient, MedicationLog } from '../types';

interface Props {
  patient: Patient;
  onClose?: () => void;
  isStandalone?: boolean;
  onSignOut?: () => void;
  onAddLog?: (log: MedicationLog) => void;
}

export const PatientAppSimulator: React.FC<Props> = ({ patient, onClose, isStandalone = false, onSignOut, onAddLog }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dispensing, setDispensing] = useState(false);
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGIC TO DETERMINE STATUS ---
  const { config, logs, device } = patient;
  
  // 1. Check Daily Limit
  const todayStr = currentTime.toDateString();
  const dosesToday = logs.filter(l => 
    (l.type === 'DOSE_TAKEN' || l.type === 'EMERGENCY_DOSE') && new Date(l.timestamp).toDateString() === todayStr
  ).length;
  
  const dailyLimitReached = dosesToday >= config.dailyLimit;

  // 2. Check Time Window
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const startMinutes = getMinutes(config.allowedStartTime);
  const endMinutes = getMinutes(config.allowedEndTime);
  
  const isOutsideWindow = currentMinutes < startMinutes || currentMinutes > endMinutes;

  // 3. Check Interval
  const lastDose = logs.find(l => l.type === 'DOSE_TAKEN' || l.type === 'EMERGENCY_DOSE');
  let nextAvailableTime = new Date();
  
  if (lastDose) {
    const lastDoseTime = new Date(lastDose.timestamp);
    nextAvailableTime = new Date(lastDoseTime.getTime() + config.intervalMinutes * 60000);
  } else {
    // No doses ever taken, ready now
    nextAvailableTime = new Date(0); 
  }

  const isIntervalLocked = currentTime < nextAvailableTime;
  const isEmpty = device.medicationLevel <= 0;

  // Consolidated Status
  let status: 'READY' | 'LOCKED' | 'EMPTY' = 'READY';
  let lockReason = "";

  if (isEmpty) {
      status = 'EMPTY';
      lockReason = "Cartridge Empty";
  } else if (dailyLimitReached) {
    status = 'LOCKED';
    lockReason = "Daily limit reached";
  } else if (isOutsideWindow) {
    status = 'LOCKED';
    lockReason = `Allowed hours: ${config.allowedStartTime} - ${config.allowedEndTime}`;
  } else if (isIntervalLocked) {
    status = 'LOCKED';
    lockReason = "Interval cooldown";
  }

  // Calculate Countdown if locked by interval
  const getCountdown = () => {
    if (!isIntervalLocked) return "00:00:00";
    const diff = nextAvailableTime.getTime() - currentTime.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDispense = (isEmergency: boolean = false) => {
      if ((status !== 'READY' && !isEmergency) || dispensing || isEmpty) return;
      
      if (isEmergency) {
          if (!confirm("Confirm Emergency Override? This will be logged.")) return;
      }

      setDispensing(true);
      
      // Simulate hardware delay
      setTimeout(() => {
          if (onAddLog) {
              const newLog: MedicationLog = {
                  id: `log-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  type: isEmergency ? 'EMERGENCY_DOSE' : 'DOSE_TAKEN',
                  note: isEmergency ? 'Manual Override' : undefined
              };
              onAddLog(newLog);
          }
          setDispensing(false);
      }, 1500);
  };

  return (
    <div className={`fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in ${isStandalone ? 'bg-slate-100' : 'p-4'}`}>
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[360px] h-[720px] border-[8px] border-slate-800 overflow-hidden flex flex-col">
        
        {/* Notch / Status Bar */}
        <div className="bg-slate-800 h-8 flex justify-center items-center rounded-t-2xl relative z-10">
            <div className="w-20 h-4 bg-black rounded-b-xl"></div>
        </div>

        {/* Close Button for Simulation - Only show if NOT standalone */}
        {!isStandalone && onClose && (
            <button 
                onClick={onClose}
                className="absolute top-12 right-4 z-20 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-600 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        )}

        {/* Logout Button for Standalone Mode */}
        {isStandalone && onSignOut && (
            <button 
                onClick={onSignOut}
                className="absolute top-12 right-4 z-20 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-600 transition-colors"
                title="Log Out"
            >
                <LogOut className="w-5 h-5" />
            </button>
        )}

        {/* --- APP CONTENT --- */}
        <div className="flex-1 bg-slate-50 flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="pt-14 pb-6 px-6 bg-white shadow-sm z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">KoCon</h2>
                        <p className="text-xs text-slate-500">Hello, {patient.name.split(' ')[0]}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mb-1">
                            {patient.name.charAt(0)}
                        </div>
                         {/* Med Level Indicator Small */}
                         <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                            <Droplets className="w-3 h-3" />
                            <span>{device.medicationLevel}%</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Main Status Display */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                
                <button 
                    onClick={() => handleDispense(false)}
                    disabled={status !== 'READY' || dispensing}
                    className={`relative w-64 h-64 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 disabled:active:scale-100 ${
                    status === 'READY' 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200 cursor-pointer hover:shadow-xl' 
                        : status === 'EMPTY'
                        ? 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-slate-200 cursor-not-allowed'
                        : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-200 cursor-not-allowed'
                }`}>
                    {/* Inner Pulse Ring */}
                    {status === 'READY' && !dispensing && (
                        <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                    )}
                    
                    <div className="text-center text-white p-4 relative z-10">
                        {dispensing ? (
                            <>
                                <SprayCan className="w-16 h-16 mx-auto mb-2 text-white/90 animate-bounce" />
                                <h3 className="text-2xl font-bold tracking-tight">Dispensing...</h3>
                            </>
                        ) : status === 'READY' ? (
                            <>
                                <CheckCircle className="w-16 h-16 mx-auto mb-2 text-white/90" />
                                <h3 className="text-2xl font-bold tracking-tight">PRESS</h3>
                                <p className="text-emerald-100 mt-1 uppercase text-sm font-bold tracking-wider">to Dispense</p>
                            </>
                        ) : status === 'EMPTY' ? (
                             <>
                                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-white/90" />
                                <h3 className="text-2xl font-bold tracking-tight">EMPTY</h3>
                                <p className="text-slate-200 text-sm font-medium mt-1">Please Refill</p>
                            </>
                        ) : (
                            <>
                                <Lock className="w-12 h-12 mx-auto mb-2 text-white/90" />
                                <h3 className="text-3xl font-mono font-bold tracking-wider mb-1">
                                    {isIntervalLocked ? getCountdown() : "LOCKED"}
                                </h3>
                                <p className="text-rose-100 text-sm font-medium px-4 mt-2 bg-black/10 py-1 rounded-full inline-block">
                                    {lockReason}
                                </p>
                            </>
                        )}
                    </div>
                </button>

                {/* Emergency Unlock Button */}
                {status === 'LOCKED' && config.emergencyUnlock && (
                    <button 
                        onClick={() => handleDispense(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold border border-rose-100 hover:bg-rose-100 transition-colors animate-pulse"
                    >
                        <AlertCircle className="w-4 h-4" />
                        Emergency Override
                    </button>
                )}

                {/* Progress Bar */}
                <div className="w-full px-4 pt-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                        <span>Daily Progress</span>
                        <span>{dosesToday} / {config.dailyLimit} doses</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${status === 'READY' ? 'bg-emerald-500' : 'bg-slate-400'}`}
                            style={{ width: `${Math.min((dosesToday / config.dailyLimit) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

            </div>

            {/* Bottom Sheet / Actions */}
            <div className="bg-white px-6 py-6 rounded-t-3xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" />
                    Today's Activity
                </h4>
                
                <div className="space-y-3 mb-6 max-h-32 overflow-y-auto">
                    {logs.filter(l => (l.type === 'DOSE_TAKEN' || l.type === 'EMERGENCY_DOSE') && new Date(l.timestamp).toDateString() === todayStr).length > 0 ? (
                        logs
                        .filter(l => (l.type === 'DOSE_TAKEN' || l.type === 'EMERGENCY_DOSE') && new Date(l.timestamp).toDateString() === todayStr)
                        .slice(0, 3)
                        .map(log => (
                            <div key={log.id} className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-lg animate-slide-in">
                                <span className={log.type === 'EMERGENCY_DOSE' ? 'text-rose-600 font-medium' : 'text-slate-600'}>
                                    {log.type === 'EMERGENCY_DOSE' ? 'Emergency Dose' : 'Dose Administered'}
                                </span>
                                <span className="font-mono text-slate-400">
                                    {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-slate-400 italic text-center py-2">No doses taken yet today.</div>
                    )}
                </div>

                <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 active:scale-95 transition-transform">
                    <Phone className="w-4 h-4" />
                    <span>Emergency Contact</span>
                </button>
            </div>
        </div>
        
        {/* Navigation Bar (Decorative) */}
        <div className="h-1 bg-white flex justify-center pb-2">
             <div className="w-32 h-1 bg-slate-300 rounded-full mt-auto mb-2"></div>
        </div>
      </div>
    </div>
  );
};