import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { LoginPage } from './components/LoginPage';
import { PatientAppSimulator } from './components/PatientAppSimulator';
import { SettingsView } from './components/SettingsView';
import { ViewState, Patient, PrescriptionConfig, UserRole, MedicationLog } from './types';
import { MOCK_PATIENTS } from './services/mockData';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    setCurrentView('PATIENT_DETAIL');
  };

  const handleUpdateConfig = (patientId: string, newConfig: PrescriptionConfig) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { 
          ...p, 
          config: newConfig,
          device: { ...p.device, lastSync: new Date().toISOString() } // Update sync time
        };
      }
      return p;
    }));
  };

  const handleAddLog = (patientId: string, log: MedicationLog) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        // Decrease medication level by 1% per dose if it's a dose
        let newLevel = p.device.medicationLevel;
        if (log.type === 'DOSE_TAKEN' || log.type === 'EMERGENCY_DOSE') {
           newLevel = Math.max(0, newLevel - 1);
        }

        const newLogs = [log, ...p.logs].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return { 
          ...p, 
          logs: newLogs,
          device: { ...p.device, medicationLevel: newLevel }
        };
      }
      return p;
    }));
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentView('DASHBOARD');
    setSelectedPatientId(null);
  };

  const handleSignOut = () => {
    setUserRole(null);
    setCurrentView('DASHBOARD');
    setSelectedPatientId(null);
  };

  // If not logged in, show login page
  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // If logged in as PATIENT, show the patient app simulator full screen
  if (userRole === 'PATIENT') {
    // For demo purposes, we simulate the first patient in the mock list
    const patientUser = patients[0]; 
    return (
      <PatientAppSimulator 
        patient={patientUser} 
        isStandalone={true}
        onSignOut={handleSignOut}
        onAddLog={(log) => handleAddLog(patientUser.id, log)}
      />
    );
  }

  // If logged in as DOCTOR, show the dashboard portal
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          if (view !== 'PATIENT_DETAIL') setSelectedPatientId(null);
        }} 
        onSignOut={handleSignOut}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {currentView === 'DASHBOARD' && (
          <Dashboard patients={patients} />
        )}

        {currentView === 'PATIENTS' && (
          <PatientList 
            patients={patients} 
            onSelectPatient={handlePatientSelect} 
            onAddPatient={handleAddPatient}
            onAddLog={handleAddLog}
          />
        )}

        {currentView === 'SETTINGS' && (
          <SettingsView />
        )}

        {currentView === 'PATIENT_DETAIL' && selectedPatient ? (
          <PatientDetail 
            patient={selectedPatient} 
            onBack={() => setCurrentView('PATIENTS')}
            onUpdateConfig={handleUpdateConfig}
            onAddLog={handleAddLog}
          />
        ) : currentView === 'PATIENT_DETAIL' && !selectedPatient ? (
           // Fallback if refresh or error
           <div className="flex flex-col items-center justify-center h-full text-slate-500">
             <p>Patient not found.</p>
             <button 
                onClick={() => setCurrentView('PATIENTS')}
                className="mt-4 text-blue-600 hover:underline"
             >
                Return to list
             </button>
           </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;