
// This file simulates a backend with ML models for demonstration purposes
// In a real implementation, this would be a separate backend server with actual ML models

import { Alert, AlertType, AlertSeverity, AlertStatus } from '../types';

// Simulated ML model results
class HostelSecurityAI {
  // Simulate altercation detection
  detectAltercation(videoFrame: string): { detected: boolean; confidence: number; location: string } {
    // In a real implementation, this would process video frames using computer vision models
    // For demo, just return random results
    const detected = Math.random() > 0.8;
    return {
      detected,
      confidence: detected ? 0.7 + Math.random() * 0.25 : Math.random() * 0.6,
      location: "Block B, 2nd Floor"
    };
  }

  // Simulate unauthorized access detection
  detectUnauthorizedAccess(videoFrame: string): { detected: boolean; confidence: number; method: string } {
    const detected = Math.random() > 0.75;
    return {
      detected,
      confidence: detected ? 0.75 + Math.random() * 0.2 : Math.random() * 0.7,
      method: detected ? "Tailgating" : ""
    };
  }

  // Simulate behavioral anomaly detection
  detectBehavioralAnomaly(videoFrame: string): { detected: boolean; confidence: number; behavior: string } {
    const detected = Math.random() > 0.85;
    const behaviors = ["Loitering", "Checking doors", "Interacting with unattended belongings"];
    return {
      detected,
      confidence: detected ? 0.7 + Math.random() * 0.25 : Math.random() * 0.65,
      behavior: detected ? behaviors[Math.floor(Math.random() * behaviors.length)] : ""
    };
  }

  // Simulate staff vigilance monitoring
  monitorStaffVigilance(videoFrame: string): { issue: boolean; confidence: number; status: string } {
    const issue = Math.random() > 0.9;
    const statuses = ["Sleeping", "Absent from post", "Inattentive", "Phone distraction"];
    return {
      issue,
      confidence: issue ? 0.8 + Math.random() * 0.15 : Math.random() * 0.5,
      status: issue ? statuses[Math.floor(Math.random() * statuses.length)] : "Attentive"
    };
  }

  // Generate a random alert (for demonstration)
  generateRandomAlert(): Alert {
    const alertTypes: AlertType[] = ["altercation", "unauthorized", "behavioral", "staff"];
    const severities: AlertSeverity[] = ["low", "medium", "high"];
    const statuses: AlertStatus[] = ["pending", "investigating", "resolved"];
    
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate titles and descriptions based on type
    let title, description, camera;
    switch (type) {
      case "altercation":
        title = "Physical altercation detected";
        description = "AI detected aggressive physical movement patterns consistent with a fight between individuals.";
        camera = "Corridor Camera 3";
        break;
      case "unauthorized":
        title = "Unauthorized access attempt";
        description = "Multiple attempts to access without proper credentials. Tailgating behavior observed.";
        camera = "Gate Camera 1";
        break;
      case "behavioral":
        title = "Suspicious behavior detected";
        description = "Individual observed spending excessive time near restricted area without clear purpose.";
        camera = "East Wing Camera 2";
        break;
      case "staff":
        title = "Guard inattention detected";
        description = "Security guard appears to be sleeping during duty hours. No movement detected for extended period.";
        camera = "Security Post Camera";
        break;
    }
    
    // Generate a random location
    const locations = ["Main Entrance", "Side Entrance", "Block A, 1st Floor", "Block B, 2nd Floor", 
                      "Common Area", "Restricted Zone", "Security Post 1", "Security Post 2"];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate a random time in the last 24 hours
    const now = new Date();
    const pastDate = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    const time = `${pastDate.getHours().toString().padStart(2, '0')}:${pastDate.getMinutes().toString().padStart(2, '0')}`;
    const date = `${pastDate.getFullYear()}-${(pastDate.getMonth() + 1).toString().padStart(2, '0')}-${pastDate.getDate().toString().padStart(2, '0')}`;
    
    return {
      id: Math.floor(Math.random() * 10000),
      type,
      title,
      description,
      location,
      time,
      date,
      severity,
      status,
      camera
    };
  }
}

// Export the simulated AI model
export const hostelSecurityAI = new HostelSecurityAI();

// This function simulates processing video frames from cameras
export function simulateVideoProcessing() {
  // In a real implementation, this would process actual video streams
  console.log("Simulating video processing with AI models...");
  
  // Generate some random alerts as a demonstration
  const alerts: Alert[] = [];
  for (let i = 0; i < 5; i++) {
    alerts.push(hostelSecurityAI.generateRandomAlert());
  }
  
  return {
    processedFrames: 1000,
    detectedEvents: alerts.length,
    alerts
  };
}

// Export information about the AI models (for display in the dashboard)
export const aiModelInfo = {
  models: [
    {
      name: "Altercation Detection",
      framework: "TensorFlow + OpenCV",
      accuracy: 0.94,
      lastTrained: "2023-04-10",
      datasetSize: "15,000 annotated frames"
    },
    {
      name: "Unauthorized Access",
      framework: "Roboflow + PyTorch",
      accuracy: 0.92,
      lastTrained: "2023-03-28",
      datasetSize: "18,500 annotated frames"
    },
    {
      name: "Behavioral Analysis",
      framework: "TensorFlow + MediaPipe",
      accuracy: 0.88,
      lastTrained: "2023-04-05",
      datasetSize: "22,000 annotated frames"
    },
    {
      name: "Staff Vigilance",
      framework: "PyTorch + OpenCV",
      accuracy: 0.96,
      lastTrained: "2023-04-15",
      datasetSize: "12,000 annotated frames"
    }
  ],
  preprocessing: {
    stages: ["Frame extraction", "Resizing", "Normalization", "Augmentation"],
    framerate: "15 FPS processed",
    resolution: "720p downscaled"
  },
  postprocessing: {
    stages: ["NMS (Non-Maximum Suppression)", "Confidence filtering", "Temporal smoothing", "Event classification"],
    alertThreshold: 0.75
  }
};
