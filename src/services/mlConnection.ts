
import { toast } from '@/components/ui/sonner';
import { Alert, AlertType, AlertSeverity } from '@/types';

const ML_API_BASE_URL = 'http://localhost:5000/api';

/**
 * Connects to the ML backend to process video frames and generate alerts
 */
export class MLConnectionService {
  private static instance: MLConnectionService;
  private isConnected: boolean = false;
  private alertCallbacks: ((alert: Alert) => void)[] = [];

  // Private constructor for singleton pattern
  private constructor() {}

  public static getInstance(): MLConnectionService {
    if (!MLConnectionService.instance) {
      MLConnectionService.instance = new MLConnectionService();
    }
    return MLConnectionService.instance;
  }

  /**
   * Test connection to the ML backend
   */
  public async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${ML_API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        this.isConnected = data.status === 'ok';
        return this.isConnected;
      }
      return false;
    } catch (error) {
      console.error('Error connecting to ML backend:', error);
      return false;
    }
  }

  /**
   * Process a video frame through all detection models
   * @param videoElement HTML video element to capture frame from
   * @param cameraId ID of the camera
   * @param cameraName Name of the camera
   * @param location Location of the camera
   */
  public async processVideoFrame(
    videoElement: HTMLVideoElement,
    cameraId: number,
    cameraName: string,
    location: string
  ): Promise<void> {
    if (!this.isConnected) {
      const connected = await this.testConnection();
      if (!connected) {
        console.warn('Cannot process frame - not connected to ML backend');
        return;
      }
    }

    try {
      // Capture video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
      });
      
      if (!blob) {
        throw new Error('Could not create image blob');
      }

      // Process frame through all detection models
      const results = await Promise.all([
        this.detectFight(blob, cameraId, cameraName, location),
        this.detectDrowsiness(blob, cameraId, cameraName, location),
        this.detectBehavior(blob, cameraId, cameraName, location),
        this.detectAccess(blob, cameraId, cameraName, location)
      ]);
      
      // Process results (if any alerts were generated)
      results.forEach(alert => {
        if (alert) {
          this.notifyAlertCallbacks(alert);
        }
      });
      
    } catch (error) {
      console.error('Error processing video frame:', error);
    }
  }

  /**
   * Detect fights in a video frame
   */
  private async detectFight(
    imageBlob: Blob,
    cameraId: number,
    cameraName: string,
    location: string
  ): Promise<Alert | null> {
    try {
      const formData = new FormData();
      formData.append('frame', imageBlob);
      
      const response = await fetch(`${ML_API_BASE_URL}/detect/fight`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Fight detection request failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Only create alert if fight is detected
      if (result.is_fight && result.confidence > 0.65) {
        const alert: Alert = {
          id: Date.now(),
          type: 'altercation',
          title: `Physical altercation detected`,
          description: `AI detected aggressive physical movement patterns between ${result.persons_involved} individuals`,
          location,
          camera: cameraName,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: result.confidence > 0.85 ? 'high' : 'medium',
          status: 'pending'
        };
        
        return alert;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fight detection:', error);
      return null;
    }
  }

  /**
   * Detect drowsiness in a video frame
   */
  private async detectDrowsiness(
    imageBlob: Blob,
    cameraId: number,
    cameraName: string,
    location: string
  ): Promise<Alert | null> {
    try {
      const formData = new FormData();
      formData.append('frame', imageBlob);
      
      const response = await fetch(`${ML_API_BASE_URL}/detect/drowsiness`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Drowsiness detection request failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Only create alert if drowsiness is detected
      if (result.is_drowsy && result.confidence > 0.7) {
        const alert: Alert = {
          id: Date.now(),
          type: 'staff',
          title: `Guard inattention detected`,
          description: `Security staff appears to be ${result.inactivity_duration > 30 ? 'sleeping' : 'drowsy'} at post. No activity detected for ${Math.round(result.inactivity_duration)} seconds.`,
          location,
          camera: cameraName,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: result.inactivity_duration > 60 ? 'high' : 'medium',
          status: 'pending'
        };
        
        return alert;
      }
      
      return null;
    } catch (error) {
      console.error('Error in drowsiness detection:', error);
      return null;
    }
  }

  /**
   * Detect unusual behaviors in a video frame
   */
  private async detectBehavior(
    imageBlob: Blob,
    cameraId: number,
    cameraName: string,
    location: string
  ): Promise<Alert | null> {
    try {
      const formData = new FormData();
      formData.append('frame', imageBlob);
      
      const response = await fetch(`${ML_API_BASE_URL}/detect/behavior`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Behavior detection request failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Only create alert if unusual behavior is detected
      if (result.unusual_behavior && result.confidence > 0.6) {
        let title = 'Unusual behavior detected';
        let description = 'AI detected behavioral patterns that require attention.';
        let severity: AlertSeverity = 'low';
        
        // Customize alert based on behavior type
        if (result.behavior_type === 'loitering') {
          title = 'Suspicious loitering detected';
          description = 'Individual observed spending excessive time in area without clear purpose.';
          severity = 'low';
        } else if (result.behavior_type === 'potential_intoxication') {
          title = 'Possible intoxication detected';
          description = 'AI detected unsteady movement and swaying indicative of potential intoxication.';
          severity = 'medium';
        }
        
        const alert: Alert = {
          id: Date.now(),
          type: 'behavioral',
          title,
          description,
          location,
          camera: cameraName,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity,
          status: 'pending'
        };
        
        return alert;
      }
      
      return null;
    } catch (error) {
      console.error('Error in behavior detection:', error);
      return null;
    }
  }

  /**
   * Detect unauthorized access in a video frame
   */
  private async detectAccess(
    imageBlob: Blob,
    cameraId: number,
    cameraName: string,
    location: string
  ): Promise<Alert | null> {
    try {
      const formData = new FormData();
      formData.append('frame', imageBlob);
      
      const response = await fetch(`${ML_API_BASE_URL}/detect/access`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Access detection request failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Only create alert if unauthorized access is detected
      if (result.unauthorized_access && result.confidence > 0.65) {
        let title = 'Unauthorized access detected';
        let description = 'Suspicious entry detected by security system.';
        
        // Customize alert based on access type
        if (result.access_type === 'tailgating') {
          title = 'Tailgating detected';
          description = `${result.person_count} individuals entered through access point at once. Possible tailgating behavior.`;
        } else if (result.access_type === 'unusual_time') {
          title = 'After-hours access detected';
          description = 'Entry detected during restricted hours.';
        }
        
        const alert: Alert = {
          id: Date.now(),
          type: 'unauthorized',
          title,
          description,
          location,
          camera: cameraName,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: 'medium',
          status: 'pending'
        };
        
        return alert;
      }
      
      return null;
    } catch (error) {
      console.error('Error in access detection:', error);
      return null;
    }
  }

  /**
   * Register a callback to receive new alerts
   */
  public registerAlertCallback(callback: (alert: Alert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Unregister an alert callback
   */
  public unregisterAlertCallback(callback: (alert: Alert) => void): void {
    this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Notify all registered callbacks of a new alert
   */
  private notifyAlertCallbacks(alert: Alert): void {
    this.alertCallbacks.forEach(callback => {
      callback(alert);
    });
    
    // Also show a toast notification
    toast.warning(`${alert.title}`, {
      description: `${alert.location} - ${alert.time}`
    });
  }
}

// Export singleton instance
export const mlService = MLConnectionService.getInstance();
