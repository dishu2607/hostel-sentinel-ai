
// Alert Types
export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus = 'pending' | 'investigating' | 'resolved';
export type AlertType = 'altercation' | 'unauthorized' | 'behavioral' | 'staff';

export interface Alert {
  id: number;
  type: AlertType;
  title: string;
  description: string;
  location: string;
  camera: string;
  time: string;
  date: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

// Camera Types
export type CameraZone = 'entrance' | 'hallways' | 'common' | 'restricted';

export interface Camera {
  id: number;
  name: string;
  zone: CameraZone;
  location: string;
  online: boolean;
  hasAlert: boolean;
}

// AI Settings Types
export interface AISettings {
  enabled: boolean;
  altercationDetection: boolean;
  unauthorizedAccess: boolean;
  behavioralAnalysis: boolean;
  staffMonitoring: boolean;
  privacyMasking: boolean;
}

// Notification Settings Types
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  criticalOnly: boolean;
}

// User Management Types
export type UserRole = 'Administrator' | 'Manager' | 'Guard' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Camera Settings Types
export type Resolution = 'sd' | 'hd' | 'fhd' | '4k';

export interface CameraSettings {
  resolution: Resolution;
  frameRate: number;
  retention: number;
  motionSensitivity: number;
}

// Analytics Types
export interface IncidentData {
  name: string;
  altercations: number;
  unauthorized: number;
  behavioral: number;
  staff: number;
}

export interface TrendData {
  name: string;
  incidents: number;
}

export interface IncidentTypeData {
  name: string;
  value: number;
  color: string;
}

export interface LocationData {
  name: string;
  incidents: number;
}

export interface PerformanceData {
  name: string;
  current: number;
  previous: number;
  unit: string;
  change: 'increase' | 'decrease';
  good: 'increase' | 'decrease';
}
