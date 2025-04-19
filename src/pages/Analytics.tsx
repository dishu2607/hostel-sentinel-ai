
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { CalendarRange, Download, Layers, TrendingUp } from "lucide-react";

// Mock data for charts
const weeklyIncidentData = [
  { name: 'Mon', altercations: 2, unauthorized: 5, behavioral: 8, staff: 1 },
  { name: 'Tue', altercations: 1, unauthorized: 3, behavioral: 6, staff: 2 },
  { name: 'Wed', altercations: 3, unauthorized: 7, behavioral: 4, staff: 0 },
  { name: 'Thu', altercations: 0, unauthorized: 4, behavioral: 9, staff: 1 },
  { name: 'Fri', altercations: 4, unauthorized: 6, behavioral: 7, staff: 2 },
  { name: 'Sat', altercations: 5, unauthorized: 8, behavioral: 12, staff: 3 },
  { name: 'Sun', altercations: 2, unauthorized: 5, behavioral: 10, staff: 1 },
];

const monthlyTrendData = [
  { name: 'Jan', incidents: 45 },
  { name: 'Feb', incidents: 52 },
  { name: 'Mar', incidents: 48 },
  { name: 'Apr', incidents: 61 },
  { name: 'May', incidents: 55 },
  { name: 'Jun', incidents: 67 },
  { name: 'Jul', incidents: 70 },
  { name: 'Aug', incidents: 55 },
  { name: 'Sep', incidents: 40 },
  { name: 'Oct', incidents: 50 },
  { name: 'Nov', incidents: 62 },
  { name: 'Dec', incidents: 58 },
];

const incidentTypeData = [
  { name: 'Altercations', value: 17, color: '#ef4444' },
  { name: 'Unauthorized Access', value: 38, color: '#f59e0b' },
  { name: 'Behavioral Anomalies', value: 56, color: '#3b82f6' },
  { name: 'Staff Issues', value: 10, color: '#8b5cf6' },
];

const locationData = [
  { name: 'Main Entrance', incidents: 15 },
  { name: 'Side Entrance', incidents: 12 },
  { name: 'Block A', incidents: 18 },
  { name: 'Block B', incidents: 24 },
  { name: 'Block C', incidents: 9 },
  { name: 'Common Area', incidents: 21 },
  { name: 'Restricted Zone', incidents: 14 },
];

const performanceData = [
  { 
    name: 'Response Time',
    current: 85,
    previous: 70,
    unit: 'sec',
    change: 'decrease',
    good: 'decrease'
  },
  { 
    name: 'Detection Accuracy',
    current: 92,
    previous: 86,
    unit: '%',
    change: 'increase',
    good: 'increase'
  },
  { 
    name: 'False Alarms',
    current: 8,
    previous: 15,
    unit: '%',
    change: 'decrease',
    good: 'decrease'
  },
  { 
    name: 'System Uptime',
    current: 99.2,
    previous: 98.5,
    unit: '%',
    change: 'increase',
    good: 'increase'
  },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center">
            <CalendarRange className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceData.map((item, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {item.current}{item.unit}
              </div>
              <div className={`flex items-center text-xs ${
                item.change === 'increase' && item.good === 'increase' ? 'text-green-500' :
                item.change === 'decrease' && item.good === 'decrease' ? 'text-green-500' :
                'text-red-500'
              }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {item.change === 'increase' ? '+' : '-'}
                {Math.abs(item.current - item.previous)}
                {item.unit} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="incidents">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="incidents">Incident Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="performance">System Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Type</CardTitle>
                <CardDescription>Weekly breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyIncidentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="altercations" name="Altercations" fill="#ef4444" />
                      <Bar dataKey="unauthorized" name="Unauthorized Access" fill="#f59e0b" />
                      <Bar dataKey="behavioral" name="Behavioral" fill="#3b82f6" />
                      <Bar dataKey="staff" name="Staff Issues" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Distribution</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incidentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incidentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                  {incidentTypeData.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Incidents by Location</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={locationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="incidents" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Incident Trends</CardTitle>
                  <CardDescription>Yearly overview</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Incidents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Incidents</SelectItem>
                    <SelectItem value="altercations">Altercations</SelectItem>
                    <SelectItem value="unauthorized">Unauthorized Access</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="staff">Staff Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="incidents" stroke="#8b5cf6" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Peak Incident Times</CardTitle>
                  <Badge>Last 30 days</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Evening (18:00-22:00)</div>
                      <div className="text-sm text-gray-500">38%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Night (22:00-06:00)</div>
                      <div className="text-sm text-gray-500">25%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Afternoon (12:00-18:00)</div>
                      <div className="text-sm text-gray-500">22%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Morning (06:00-12:00)</div>
                      <div className="text-sm text-gray-500">15%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-sm font-medium text-amber-800">Unauthorized Access Pattern</h3>
                    <p className="text-xs text-amber-700 mt-1">
                      Repeated attempts at side entrance between 23:00-00:00 on weekends.
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-sm font-medium text-red-800">Altercation Hotspot</h3>
                    <p className="text-xs text-red-700 mt-1">
                      Block B, 2nd floor shows 63% higher incident rate than other areas.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Guard Performance</h3>
                    <p className="text-xs text-blue-700 mt-1">
                      Night shift efficiency drops by 35% after 02:00.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quarterly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-full justify-center">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-green-600">-12%</h3>
                    <p className="text-sm text-gray-500">Overall incidents compared to previous quarter</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h4 className="text-lg font-bold text-red-500">+8%</h4>
                      <p className="text-xs text-gray-500">Altercations</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h4 className="text-lg font-bold text-green-500">-15%</h4>
                      <p className="text-xs text-gray-500">Unauthorized</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h4 className="text-lg font-bold text-green-500">-18%</h4>
                      <p className="text-xs text-gray-500">Behavioral</p>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h4 className="text-lg font-bold text-green-500">-22%</h4>
                      <p className="text-xs text-gray-500">Staff Issues</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Detection efficiency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Jan', accuracy: 82, response: 120 },
                      { name: 'Feb', accuracy: 83, response: 110 },
                      { name: 'Mar', accuracy: 86, response: 105 },
                      { name: 'Apr', accuracy: 87, response: 95 },
                      { name: 'May', accuracy: 89, response: 90 },
                      { name: 'Jun', accuracy: 90, response: 85 },
                      { name: 'Jul', accuracy: 92, response: 82 },
                      { name: 'Aug', accuracy: 91, response: 83 },
                      { name: 'Sep', accuracy: 93, response: 80 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="response" name="Response Time (s)" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Model Accuracy</CardTitle>
                <CardDescription>By detection type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Altercation Detection</div>
                      <div className="text-sm text-gray-500">94%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Unauthorized Access</div>
                      <div className="text-sm text-gray-500">92%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Behavioral Anomalies</div>
                      <div className="text-sm text-gray-500">88%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Staff Monitoring</div>
                      <div className="text-sm text-gray-500">96%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Recent Improvements</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                      Night vision accuracy improved by 15% with latest model update
                    </div>
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                      False positive rate reduced by 8% for unauthorized access detection
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current status of all components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Camera Network</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Healthy</Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <Layers className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">24 of 24 cameras online</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">Last check: 5 min ago</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">AI Processing</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Optimal</Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <Layers className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">CPU: 42% | Memory: 58%</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">Last check: 3 min ago</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Alert System</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Operational</Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <Layers className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Avg response: 82ms</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">Last check: 7 min ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
