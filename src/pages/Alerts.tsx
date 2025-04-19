
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  DoorOpen, 
  Users, 
  Clock, 
  Shield, 
  MapPin, 
  Filter, 
  CheckCircle, 
  XCircle,
  Video
} from "lucide-react";

// Mock alert data
const mockAlerts = [
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
  { 
    id: 2, 
    type: "unauthorized", 
    title: "Unauthorized access attempt", 
    location: "Main Entrance Gate", 
    time: "20:12", 
    date: "2023-05-18", 
    severity: "medium",
    status: "investigating",
    description: "Multiple attempts to access main gate without proper credentials. Tailgating behavior observed.",
    camera: "Gate Camera 1"
  },
  { 
    id: 3, 
    type: "behavioral", 
    title: "Suspicious loitering detected", 
    location: "Restricted Area, East Wing", 
    time: "18:30", 
    date: "2023-05-18", 
    severity: "low",
    status: "resolved",
    description: "Individual observed spending excessive time near restricted storage area without clear purpose.",
    camera: "East Wing Camera 2"
  },
  { 
    id: 4, 
    type: "staff", 
    title: "Guard inattention detected", 
    location: "Security Post 2", 
    time: "03:15", 
    date: "2023-05-18", 
    severity: "high",
    status: "pending",
    description: "Night shift security guard appears to be sleeping during duty hours. No movement detected for 25 minutes.",
    camera: "Security Post Camera"
  },
  { 
    id: 5, 
    type: "unauthorized", 
    title: "Multiple unauthorized entries", 
    location: "Side Entrance", 
    time: "23:40", 
    date: "2023-05-17", 
    severity: "high",
    status: "resolved",
    description: "Group of 3 individuals entered through side door by following an authorized resident.",
    camera: "Side Entrance Camera 1"
  },
];

const AlertTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "altercation":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "unauthorized":
      return <DoorOpen className="h-5 w-5 text-amber-500" />;
    case "behavioral":
      return <Users className="h-5 w-5 text-blue-500" />;
    case "staff":
      return <Shield className="h-5 w-5 text-purple-500" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>;
    case "investigating":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Investigating</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || alert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selectedAlertData = mockAlerts.find(alert => alert.id === selectedAlert);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Alerts</h1>
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-1/2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Alert Feed</CardTitle>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search alerts..." 
                    className="h-8 w-[200px]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Tabs defaultValue="all" onValueChange={setFilterStatus}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="investigating">Investigating</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No alerts matching your criteria
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAlert === alert.id 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedAlert(alert.id)}
                    >
                      <div className="flex items-start">
                        <div className={`mr-4 mt-1`}>
                          <AlertTypeIcon type={alert.type} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{alert.title}</h3>
                            <StatusBadge status={alert.status} />
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="mr-3">{alert.location}</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{alert.date} {alert.time}</span>
                          </div>
                          <div className="mt-2">
                            <Badge variant={
                              alert.severity === "high" ? "destructive" : 
                              alert.severity === "medium" ? "default" : "secondary"
                            } className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2">
          {selectedAlertData ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <AlertTypeIcon type={selectedAlertData.type} />
                      <span className="ml-2">{selectedAlertData.title}</span>
                    </CardTitle>
                    <CardDescription>
                      Alert ID: #{selectedAlertData.id} • {selectedAlertData.date} {selectedAlertData.time}
                    </CardDescription>
                  </div>
                  <StatusBadge status={selectedAlertData.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAlertData.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {selectedAlertData.location}
                    </div>
                    <div className="flex items-center mt-2">
                      <Video className="h-4 w-4 mr-2 text-gray-500" />
                      {selectedAlertData.camera}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Camera Feed</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-600" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <div className="flex justify-between text-sm">
                        <span>{selectedAlertData.camera}</span>
                        <span>{selectedAlertData.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Shield className="mr-2 h-4 w-4" />
                    Assign to Guard
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <XCircle className="mr-2 h-4 w-4" />
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="text-center text-gray-500">
                  <AlertTriangle className="mx-auto h-10 w-10 mb-3 text-gray-400" />
                  <p>Select an alert to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
