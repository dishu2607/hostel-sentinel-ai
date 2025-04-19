
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  Shield, 
  Video, 
  User, 
  Users, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Check, 
  Save
} from "lucide-react";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    criticalOnly: false
  });

  const [cameraSettings, setCameraSettings] = useState({
    resolution: "hd",
    frameRate: 15,
    retention: 30,
    motionSensitivity: 65
  });

  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    altercationDetection: true,
    unauthorizedAccess: true,
    behavioralAnalysis: true,
    staffMonitoring: true,
    privacyMasking: true
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="camera">Camera & Video</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="users">Users & Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
                <Switch 
                  id="push-notifications" 
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, push: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="critical-only">Critical Alerts Only</Label>
                </div>
                <Switch 
                  id="critical-only" 
                  checked={notificationSettings.criticalOnly}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, criticalOnly: checked})}
                />
              </div>
              
              <div className="pt-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input id="notification-email" placeholder="admin@yourcompany.com" className="mt-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>General system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone" className="mt-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger id="date-format" className="mt-1">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger id="language" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Camera Configuration</CardTitle>
              <CardDescription>Adjust camera and video settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resolution">Video Resolution</Label>
                <Select 
                  value={cameraSettings.resolution}
                  onValueChange={(val) => setCameraSettings({...cameraSettings, resolution: val})}
                >
                  <SelectTrigger id="resolution">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sd">SD (640x480)</SelectItem>
                    <SelectItem value="hd">HD (1280x720)</SelectItem>
                    <SelectItem value="fhd">Full HD (1920x1080)</SelectItem>
                    <SelectItem value="4k">4K (3840x2160)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="framerate">Frame Rate (FPS): {cameraSettings.frameRate}</Label>
                </div>
                <Slider 
                  id="framerate" 
                  min={5} 
                  max={30} 
                  step={1} 
                  value={[cameraSettings.frameRate]} 
                  onValueChange={(val) => setCameraSettings({...cameraSettings, frameRate: val[0]})}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 FPS</span>
                  <span>30 FPS</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="motion-sensitivity">Motion Detection Sensitivity: {cameraSettings.motionSensitivity}%</Label>
                </div>
                <Slider 
                  id="motion-sensitivity" 
                  min={0} 
                  max={100} 
                  step={5} 
                  value={[cameraSettings.motionSensitivity]} 
                  onValueChange={(val) => setCameraSettings({...cameraSettings, motionSensitivity: val[0]})}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retention">Video Retention Period (Days)</Label>
                <Select 
                  value={cameraSettings.retention.toString()}
                  onValueChange={(val) => setCameraSettings({...cameraSettings, retention: parseInt(val)})}
                >
                  <SelectTrigger id="retention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Camera Zones</CardTitle>
              <CardDescription>Configure privacy zones and detection areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Privacy Zones</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Areas excluded from recording and AI analysis
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Bathroom Areas</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Dormitory Windows</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    <EyeOff className="mr-2 h-4 w-4" />
                    Add Privacy Zone
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Detection Zones</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Areas with enhanced monitoring and alerts
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Main Entrance</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Storage Area</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    <Eye className="mr-2 h-4 w-4" />
                    Add Detection Zone
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Detection Features</CardTitle>
              <CardDescription>Enable or disable AI monitoring features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI-Powered Monitoring</div>
                  <div className="text-sm text-gray-500">Master switch for all AI features</div>
                </div>
                <Switch 
                  checked={aiSettings.enabled}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, enabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Altercation Detection</div>
                  <div className="text-sm text-gray-500">Detect physical fights and aggressive behavior</div>
                </div>
                <Switch 
                  checked={aiSettings.altercationDetection}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, altercationDetection: checked})}
                  disabled={!aiSettings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Unauthorized Access Detection</div>
                  <div className="text-sm text-gray-500">Identify tailgating and unauthorized entry</div>
                </div>
                <Switch 
                  checked={aiSettings.unauthorizedAccess}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, unauthorizedAccess: checked})}
                  disabled={!aiSettings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Behavioral Anomaly Recognition</div>
                  <div className="text-sm text-gray-500">Detect unusual actions and suspicious behavior</div>
                </div>
                <Switch 
                  checked={aiSettings.behavioralAnalysis}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, behavioralAnalysis: checked})}
                  disabled={!aiSettings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Staff Vigilance Monitoring</div>
                  <div className="text-sm text-gray-500">Track security guard attention and performance</div>
                </div>
                <Switch 
                  checked={aiSettings.staffMonitoring}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, staffMonitoring: checked})}
                  disabled={!aiSettings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Privacy Masking</div>
                  <div className="text-sm text-gray-500">Automatically blur or mask sensitive areas</div>
                </div>
                <Switch 
                  checked={aiSettings.privacyMasking}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, privacyMasking: checked})}
                  disabled={!aiSettings.enabled}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Sensitivity Configuration</CardTitle>
              <CardDescription>Adjust detection thresholds and sensitivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Altercation Detection Threshold</Label>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <Slider defaultValue={[75]} min={0} max={100} step={5} disabled={!aiSettings.enabled || !aiSettings.altercationDetection} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Sensitive</span>
                  <span>More Sensitive</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Unauthorized Access Sensitivity</Label>
                  <span className="text-sm text-gray-500">80%</span>
                </div>
                <Slider defaultValue={[80]} min={0} max={100} step={5} disabled={!aiSettings.enabled || !aiSettings.unauthorizedAccess} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Sensitive</span>
                  <span>More Sensitive</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Behavioral Anomaly Threshold</Label>
                  <span className="text-sm text-gray-500">65%</span>
                </div>
                <Slider defaultValue={[65]} min={0} max={100} step={5} disabled={!aiSettings.enabled || !aiSettings.behavioralAnalysis} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Sensitive</span>
                  <span>More Sensitive</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Staff Vigilance Monitoring Sensitivity</Label>
                  <span className="text-sm text-gray-500">70%</span>
                </div>
                <Slider defaultValue={[70]} min={0} max={100} step={5} disabled={!aiSettings.enabled || !aiSettings.staffMonitoring} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Sensitive</span>
                  <span>More Sensitive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Roles
                  </Button>
                </div>
                
                <div className="border rounded-lg divide-y">
                  {[
                    { name: "Admin User", email: "admin@example.com", role: "Administrator", status: "Active" },
                    { name: "Security Manager", email: "security@example.com", role: "Manager", status: "Active" },
                    { name: "Guard 1", email: "guard1@example.com", role: "Guard", status: "Active" },
                    { name: "Guard 2", email: "guard2@example.com", role: "Guard", status: "Inactive" },
                  ].map((user, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className={
                          user.status === "Active" 
                            ? "bg-green-50 text-green-600 border-green-200" 
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }>
                          {user.status}
                        </Badge>
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                          {user.role}
                        </Badge>
                        <Button variant="ghost" size="sm" className="ml-4">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Configure permission levels and access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 p-3 bg-gray-50 dark:bg-gray-800 font-medium text-sm">
                    <div className="col-span-2">Permission</div>
                    <div className="text-center">Administrator</div>
                    <div className="text-center">Manager</div>
                    <div className="text-center">Guard</div>
                    <div className="text-center">Viewer</div>
                  </div>
                  
                  {[
                    { name: "View Live Camera Feeds", admin: true, manager: true, guard: true, viewer: true },
                    { name: "Access Recorded Footage", admin: true, manager: true, guard: true, viewer: false },
                    { name: "Respond to Alerts", admin: true, manager: true, guard: true, viewer: false },
                    { name: "Manage Camera Settings", admin: true, manager: true, guard: false, viewer: false },
                    { name: "Configure AI Features", admin: true, manager: false, guard: false, viewer: false },
                    { name: "User Management", admin: true, manager: false, guard: false, viewer: false },
                  ].map((permission, idx) => (
                    <div key={idx} className="grid grid-cols-6 p-3 border-t">
                      <div className="col-span-2">{permission.name}</div>
                      <div className="flex justify-center">
                        {permission.admin ? <Check className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-gray-300" />}
                      </div>
                      <div className="flex justify-center">
                        {permission.manager ? <Check className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-gray-300" />}
                      </div>
                      <div className="flex justify-center">
                        {permission.guard ? <Check className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-gray-300" />}
                      </div>
                      <div className="flex justify-center">
                        {permission.viewer ? <Check className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-gray-300" />}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="mt-3">
                  <Save className="mr-2 h-4 w-4" />
                  Save Permission Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
