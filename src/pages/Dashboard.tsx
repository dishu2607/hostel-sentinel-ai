
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Users, Video, MapPin, Clock, DoorOpen } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          System Active
        </Badge>
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Critical Alert</AlertTitle>
        <AlertDescription>
          Possible altercation detected in Hostel Block B, Camera 3 at 22:45.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Altercation Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
            <Progress value={30} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unauthorized Access</CardTitle>
            <DoorOpen className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            <Progress value={70} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Behavioral Anomalies</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
            <Progress value={50} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Staff Vigilance</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
            <Progress value={92} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Last 24 hours activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, type: "Altercation", location: "Block B, Room 23", time: "22:45", severity: "high" },
                { id: 2, type: "Unauthorized Access", location: "Main Entrance", time: "20:12", severity: "medium" },
                { id: 3, type: "Loitering", location: "Restricted Zone", time: "18:30", severity: "low" },
                { id: 4, type: "Staff Sleeping", location: "Security Post 2", time: "03:15", severity: "high" },
              ].map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-2 h-10 rounded-full mr-4 ${
                      alert.severity === "high" ? "bg-red-500" : 
                      alert.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                    <div>
                      <h3 className="font-medium">{alert.type}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                        <Clock className="h-3 w-3 ml-2 mr-1" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    alert.severity === "high" ? "destructive" : 
                    alert.severity === "medium" ? "default" : "secondary"
                  }>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Camera Feeds</CardTitle>
            <CardDescription>Live monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((camera) => (
                <div key={camera} className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden border border-gray-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                    <div className="flex justify-between">
                      <span>Camera {camera}</span>
                      <span className="text-green-400">Live</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
