
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, AlertTriangle, Video, Users, DoorOpen, Shield, RefreshCw } from "lucide-react";
import { toast } from '@/components/ui/sonner';
import { mlService } from "@/services/mlConnection";

const MLSettings = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  // ML model settings
  const [fightDetection, setFightDetection] = useState(true);
  const [fightThreshold, setFightThreshold] = useState(70);
  
  const [drowsinessDetection, setDrowsinessDetection] = useState(true);
  const [drowsinessThreshold, setDrowsinessThreshold] = useState(65);
  
  const [behaviorDetection, setBehaviorDetection] = useState(true);
  const [behaviorThreshold, setBehaviorThreshold] = useState(60);
  
  const [accessDetection, setAccessDetection] = useState(true);
  const [accessThreshold, setAccessThreshold] = useState(65);

  const testConnection = async () => {
    setConnecting(true);
    try {
      const isConnected = await mlService.testConnection();
      setConnected(isConnected);
      
      if (isConnected) {
        toast.success("Connected to ML Backend", {
          description: "Successfully connected to the ML detection service"
        });
      } else {
        toast.error("Connection Failed", {
          description: "Could not connect to ML backend. Ensure the server is running."
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnected(false);
      toast.error("Connection Error", {
        description: "Error connecting to ML backend. Check console for details."
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ML Model Settings</h1>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={connected ? "default" : "outline"} 
            className={connected ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
          >
            {connected ? "Connected" : "Disconnected"}
          </Badge>
          <Button onClick={testConnection} disabled={connecting} size="sm">
            {connecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-purple-500" />
            ML Backend Configuration
          </CardTitle>
          <CardDescription>
            Configure the connection to your ML detection models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">ML Backend URL</h3>
                  <p className="text-sm text-gray-500">The URL of your ML backend server</p>
                </div>
                <code className="px-2 py-1 bg-gray-100 rounded text-sm">http://localhost:5000/api</code>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Connection Status</h3>
                  <p className="text-sm text-gray-500">Check if the ML backend is accessible</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{connected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fight Detection Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Fight Detection
            </CardTitle>
            <CardDescription>
              Configure the fight detection model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fight-enabled">Enabled</Label>
                  <p className="text-sm text-gray-500">Turn fight detection on or off</p>
                </div>
                <Switch
                  id="fight-enabled"
                  checked={fightDetection}
                  onCheckedChange={setFightDetection}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="fight-threshold">Detection Threshold ({fightThreshold}%)</Label>
                </div>
                <Slider 
                  id="fight-threshold"
                  defaultValue={[fightThreshold]} 
                  max={100} 
                  step={5}
                  disabled={!fightDetection}
                  onValueChange={(vals) => setFightThreshold(vals[0])}
                />
                <p className="text-xs text-gray-500">
                  Higher values mean fewer false positives but may miss some incidents
                </p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Model Information</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Model Type:</span>
                    <span>Pose + Motion Analysis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dataset:</span>
                    <span>RWF-2000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>92%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drowsiness Detection Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-purple-500" />
              Drowsiness Detection
            </CardTitle>
            <CardDescription>
              Configure the staff drowsiness detection model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="drowsiness-enabled">Enabled</Label>
                  <p className="text-sm text-gray-500">Turn drowsiness detection on or off</p>
                </div>
                <Switch
                  id="drowsiness-enabled"
                  checked={drowsinessDetection}
                  onCheckedChange={setDrowsinessDetection}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="drowsiness-threshold">Detection Threshold ({drowsinessThreshold}%)</Label>
                </div>
                <Slider 
                  id="drowsiness-threshold"
                  defaultValue={[drowsinessThreshold]} 
                  max={100} 
                  step={5}
                  disabled={!drowsinessDetection}
                  onValueChange={(vals) => setDrowsinessThreshold(vals[0])}
                />
                <p className="text-xs text-gray-500">
                  Higher values reduce false alarms but may be less sensitive to early signs
                </p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Model Information</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Model Type:</span>
                    <span>Face Mesh + Eye Analysis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dataset:</span>
                    <span>UTA-RLDD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>88%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Behavior Detection Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Behavior Detection
            </CardTitle>
            <CardDescription>
              Configure the behavioral anomaly detection model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="behavior-enabled">Enabled</Label>
                  <p className="text-sm text-gray-500">Turn behavior detection on or off</p>
                </div>
                <Switch
                  id="behavior-enabled"
                  checked={behaviorDetection}
                  onCheckedChange={setBehaviorDetection}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="behavior-threshold">Detection Threshold ({behaviorThreshold}%)</Label>
                </div>
                <Slider 
                  id="behavior-threshold"
                  defaultValue={[behaviorThreshold]} 
                  max={100} 
                  step={5}
                  disabled={!behaviorDetection}
                  onValueChange={(vals) => setBehaviorThreshold(vals[0])}
                />
                <p className="text-xs text-gray-500">
                  Controls sensitivity to unusual behaviors including potential intoxication
                </p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Model Information</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Model Type:</span>
                    <span>Pose + Temporal Analysis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dataset:</span>
                    <span>HMDB51 (Custom)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>85%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Detection Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DoorOpen className="mr-2 h-5 w-5 text-amber-500" />
              Access Detection
            </CardTitle>
            <CardDescription>
              Configure the unauthorized access detection model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="access-enabled">Enabled</Label>
                  <p className="text-sm text-gray-500">Turn access detection on or off</p>
                </div>
                <Switch
                  id="access-enabled"
                  checked={accessDetection}
                  onCheckedChange={setAccessDetection}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="access-threshold">Detection Threshold ({accessThreshold}%)</Label>
                </div>
                <Slider 
                  id="access-threshold"
                  defaultValue={[accessThreshold]} 
                  max={100} 
                  step={5}
                  disabled={!accessDetection}
                  onValueChange={(vals) => setAccessThreshold(vals[0])}
                />
                <p className="text-xs text-gray-500">
                  Controls sensitivity to unauthorized access patterns
                </p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Model Information</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Model Type:</span>
                    <span>Object Detection + Tracking</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dataset:</span>
                    <span>Custom Dataset</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default MLSettings;
