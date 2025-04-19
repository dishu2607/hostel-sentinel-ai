
import { Alert, Camera, User, AISettings, NotificationSettings, CameraSettings, AlertStatus } from '../types';

// This is a mock API service for now
// When you develop your backend with ML models, replace these functions with actual API calls

// Base URL for your API
const BASE_URL = 'http://localhost:5000/api';

// Fetch alerts with optional filters
export const fetchAlerts = async (filters?: { 
  status?: string; 
  severity?: string; 
  type?: string;
  from?: string;
  to?: string;
}): Promise<Alert[]> => {
  // In a real implementation, you would make an API call like:
  // const response = await fetch(`${BASE_URL}/alerts?${new URLSearchParams(filters)}`);
  // return await response.json();
  
  // For now, we'll simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock data
      resolve([
        { 
          id: 1, 
          type: "altercation", 
          title: "Physical altercation detected", 
          location: "Block B, 2nd Floor Corridor", 
          time: "22:45", 
          date: "2023-05-18", 
          severity: "high",
          status: "pending",
          description: "AI detected aggressive physical movement patterns consistent with a fight between two individuals.",
          camera: "Corridor Camera 3"
        },
        // Add more mock alerts here
      ] as Alert[]);
    }, 500);
  });
};

// Fetch cameras
export const fetchCameras = async (zone?: string): Promise<Camera[]> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/cameras${zone ? `?zone=${zone}` : ''}`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Main Entrance Camera", zone: "entrance", location: "Front Gate", online: true, hasAlert: false },
        { id: 2, name: "Side Entrance Camera", zone: "entrance", location: "East Wing", online: true, hasAlert: false },
        { id: 3, name: "Hallway Camera 1", zone: "hallways", location: "Block A, 1st Floor", online: true, hasAlert: true },
        // Add more mock cameras
      ] as Camera[]);
    }, 500);
  });
};

// Fetch analytics data
export const fetchAnalyticsData = async (period: string = 'week') => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/analytics?period=${period}`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        incidentCount: 42,
        altercationCount: 8,
        unauthorizedCount: 15,
        behavioralCount: 14,
        staffIssuesCount: 5,
        // Add more analytics data as needed
      });
    }, 700);
  });
};

// Get AI settings
export const getAISettings = async (): Promise<AISettings> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/settings/ai`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        enabled: true,
        altercationDetection: true,
        unauthorizedAccess: true,
        behavioralAnalysis: true,
        staffMonitoring: true,
        privacyMasking: true
      });
    }, 300);
  });
};

// Update AI settings
export const updateAISettings = async (settings: AISettings): Promise<AISettings> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/settings/ai`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(settings),
  // });
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(settings);
    }, 300);
  });
};

// Get users
export const getUsers = async (): Promise<User[]> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/users`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Admin User", email: "admin@example.com", role: "Administrator", status: "Active" },
        { id: 2, name: "Security Manager", email: "security@example.com", role: "Manager", status: "Active" },
        { id: 3, name: "Guard 1", email: "guard1@example.com", role: "Guard", status: "Active" },
        { id: 4, name: "Guard 2", email: "guard2@example.com", role: "Guard", status: "Inactive" },
      ] as User[]);
    }, 500);
  });
};

// Get notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/settings/notifications`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: true,
        push: true,
        sms: false,
        criticalOnly: false
      });
    }, 300);
  });
};

// Update notification settings
export const updateNotificationSettings = async (settings: NotificationSettings): Promise<NotificationSettings> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/settings/notifications`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(settings),
  // });
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(settings);
    }, 300);
  });
};

// Get camera settings
export const getCameraSettings = async (): Promise<CameraSettings> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/settings/cameras`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        resolution: "hd",
        frameRate: 15,
        retention: 30,
        motionSensitivity: 65
      });
    }, 300);
  });
};

// Update camera settings
export const updateCameraSettings = async (settings: CameraSettings): Promise<CameraSettings> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/settings/cameras`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(settings),
  // });
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(settings);
    }, 300);
  });
};

// Respond to an alert (mark as investigating, resolved, etc.)
export const updateAlertStatus = async (alertId: number, status: string): Promise<Alert> => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/alerts/${alertId}/status`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ status }),
  // });
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: alertId,
        type: "altercation",
        title: "Physical altercation detected",
        location: "Block B, 2nd Floor Corridor",
        time: "22:45",
        date: "2023-05-18",
        severity: "high",
        status: status as AlertStatus,
        description: "AI detected aggressive physical movement patterns consistent with a fight between two individuals.",
        camera: "Corridor Camera 3"
      } as Alert);
    }, 300);
  });
};

// ML Model Information
export const getModelInfo = async () => {
  // In a real implementation:
  // const response = await fetch(`${BASE_URL}/ml/model-info`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        modelName: "HostelSentinel v1.2",
        lastTrained: "2023-04-15",
        accuracy: 0.92,
        frameworks: ["TensorFlow", "OpenCV", "Roboflow"],
        datasets: ["Custom Hostel Security Dataset", "Public Violence Detection Dataset"],
        modelSize: "245MB"
      });
    }, 400);
  });
};
