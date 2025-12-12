import { Patient, DeviceStatus } from '../types';

const generateLogs = (days: number): any[] => {
  const logs = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Successful dose morning
    date.setHours(8, 30, 0);
    logs.push({
      id: `log-${i}-1`,
      timestamp: date.toISOString(),
      type: 'DOSE_TAKEN'
    });

    // Successful dose noon
    date.setHours(13, 15, 0);
    logs.push({
      id: `log-${i}-2`,
      timestamp: date.toISOString(),
      type: 'DOSE_TAKEN'
    });

    // Blocked attempt night (simulation of craving)
    if (i % 3 === 0) {
       date.setHours(23, 45, 0);
       logs.push({
         id: `log-${i}-3`,
         timestamp: date.toISOString(),
         type: 'ATTEMPT_BLOCKED',
         note: 'Outside allowed timeframe'
       });
    }
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    name: 'Hans Müller',
    age: 54,
    condition: 'Chronic Pain Management',
    device: {
      serialId: 'KOCON-XH-9921',
      batteryLevel: 85,
      medicationLevel: 42,
      lastSync: new Date().toISOString(),
      firmwareVersion: '1.4.2',
      status: DeviceStatus.ONLINE
    },
    config: {
      intervalMinutes: 240,
      dailyLimit: 4,
      therapyDurationDays: 14,
      allowedStartTime: '08:00',
      allowedEndTime: '22:00',
      emergencyUnlock: false
    },
    logs: generateLogs(7)
  },
  {
    id: 'p-102',
    name: 'Sabine Weber',
    age: 32,
    condition: 'Post-Op Recovery',
    device: {
      serialId: 'KOCON-XH-4410',
      batteryLevel: 12,
      medicationLevel: 8,
      lastSync: '2023-10-25T09:00:00.000Z',
      firmwareVersion: '1.4.0',
      status: DeviceStatus.OFFLINE
    },
    config: {
      intervalMinutes: 360,
      dailyLimit: 3,
      therapyDurationDays: 7,
      allowedStartTime: '09:00',
      allowedEndTime: '20:00',
      emergencyUnlock: true
    },
    logs: generateLogs(3)
  },
    {
    id: 'p-103',
    name: 'Michael Schmidt',
    age: 67,
    condition: 'Palliative Care',
    device: {
      serialId: 'KOCON-XH-1102',
      batteryLevel: 92,
      medicationLevel: 88,
      lastSync: new Date().toISOString(),
      firmwareVersion: '1.4.2',
      status: DeviceStatus.ONLINE
    },
    config: {
      intervalMinutes: 120,
      dailyLimit: 8,
      therapyDurationDays: 30,
      allowedStartTime: '06:00',
      allowedEndTime: '23:59',
      emergencyUnlock: false
    },
    logs: []
  }
];