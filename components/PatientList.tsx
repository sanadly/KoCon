import React, { useState } from 'react';
import { Search, Plus, Smartphone, ChevronRight, Eye } from 'lucide-react';
import { Patient, DeviceStatus, MedicationLog } from '../types';
import { PatientAppSimulator } from './PatientAppSimulator';
import { RegisterDeviceModal } from './RegisterDeviceModal';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
  onAddPatient?: (patient: Patient) => void;
  onAddLog?: (patientId: string, log: MedicationLog) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient, onAddPatient, onAddLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [simulatingPatient, setSimulatingPatient] = useState<Patient | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.device.serialId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Simulator Modal */}
      {simulatingPatient && (
        <PatientAppSimulator 
          patient={simulatingPatient} 
          onClose={() => setSimulatingPatient(null)} 
          onAddLog={(log) => onAddLog && onAddLog(simulatingPatient.id, log)}
        />
      )}

      {/* Register Device Modal */}
      {showRegisterModal && onAddPatient && (
        <RegisterDeviceModal
          onClose={() => setShowRegisterModal(false)}
          onRegister={onAddPatient}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">Patients</h1>
           <p className="text-slate-500">Manage active prescriptions and devices.</p>
        </div>
        <button 
          onClick={() => setShowRegisterModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
            <Plus className="w-4 h-4" />
            <span>Register New Device</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100">
            <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                    type="text" 
                    placeholder="Search by patient name or device ID..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Device ID</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last Sync</th>
                        <th className="px-6 py-4 text-center">App View</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 cursor-pointer" onClick={() => onSelectPatient(patient.id)}>
                                <div className="font-medium text-slate-900">{patient.name}</div>
                                <div className="text-xs text-slate-500">{patient.condition}</div>
                            </td>
                            <td className="px-6 py-4 flex items-center space-x-2 text-slate-600 cursor-pointer" onClick={() => onSelectPatient(patient.id)}>
                                <Smartphone className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-mono">{patient.device.serialId}</span>
                            </td>
                            <td className="px-6 py-4 cursor-pointer" onClick={() => onSelectPatient(patient.id)}>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    patient.device.status === DeviceStatus.ONLINE 
                                    ? 'bg-green-100 text-green-800'
                                    : patient.device.status === DeviceStatus.OFFLINE
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        patient.device.status === DeviceStatus.ONLINE ? 'bg-green-600' : 'bg-slate-500'
                                    }`}></span>
                                    {patient.device.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 cursor-pointer" onClick={() => onSelectPatient(patient.id)}>
                                {new Date(patient.device.lastSync).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSimulatingPatient(patient);
                                    }}
                                    className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-full transition-colors"
                                    title="Open Patient App Simulator"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right cursor-pointer" onClick={() => onSelectPatient(patient.id)}>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </td>
                        </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                No patients found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};