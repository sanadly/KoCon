export enum DeviceStatus {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  SYNC_PENDING = 'Sync Pending',
  LOCKED = 'Locked'
}

export interface MedicationLog {
  id: string;
  timestamp: string; // ISO String
  type: 'DOSE_TAKEN' | 'ATTEMPT_BLOCKED' | 'DEVICE_ERROR' | 'EMERGENCY_DOSE';
  note?: string;
}

export interface PrescriptionConfig {
  intervalMinutes: number;
  dailyLimit: number;
  therapyDurationDays: number;
  allowedStartTime: string; // "08:00"
  allowedEndTime: string; // "20:00"
  emergencyUnlock: boolean;
}

export interface Device {
  serialId: string;
  batteryLevel: number; // 0-100
  medicationLevel: number; // 0-100 (New field)
  lastSync: string; // ISO String
  firmwareVersion: string;
  status: DeviceStatus;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  device: Device;
  config: PrescriptionConfig;
  logs: MedicationLog[];
}

export type ViewState = 'DASHBOARD' | 'PATIENTS' | 'PATIENT_DETAIL' | 'SETTINGS';

export type UserRole = 'DOCTOR' | 'PATIENT' | null;