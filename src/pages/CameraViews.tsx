
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Video, Maximize2, MessageCircle, AlertTriangle, Clock } from "lucide-react";

const cameraSections = [
  { id: "entrance", name: "Entrance & Gates" },
  { id: "hallways", name: "Hallways & Corridors" },
  { id: "common", name: "Common Areas" },
  { id: "restricted", name: "Restricted Zones" },
];

const CameraViews = () => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Camera Views</h1>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="entrance">Entrance & Gates</SelectItem>
              <SelectItem value="hallways">Hallways & Corridors</SelectItem>
              <SelectItem value="common">Common Areas</SelectItem>
              <SelectItem value="restricted">Restricted Zones</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Playback
          </Button>
        </div>
      </div>

      <Tabs defaultValue="entrance">
        <TabsList className="grid grid-cols-4">
          {cameraSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {cameraSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer ${selectedCamera === `${section.id}-${index}` ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCamera(`${section.id}-${index}`)}
                >
                  <div className="aspect-video bg-gray-800 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-10 w-10 text-gray-600" />
                    </div>
                    {index === 0 && section.id === "hallways" && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alert
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                      <div className="flex justify-between">
                        <span>{section.name} - Camera {index + 1}</span>
                        <span className="text-green-400 flex items-center">
                          <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                          Live
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">{section.name} {index + 1}</div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedCamera && (
        <Card>
          <CardHeader>
            <CardTitle>Full View: {selectedCamera.split('-')[0]} Camera {parseInt(selectedCamera.split('-')[1]) + 1}</CardTitle>
            <CardDescription>Live feed with AI monitoring active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-16 w-16 text-gray-600" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{selectedCamera.split('-')[0]} Area - Camera {parseInt(selectedCamera.split('-')[1]) + 1}</div>
                    <div className="text-xs text-gray-300">AI Analysis: No anomalies detected</div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="text-xs mr-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Playback
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CameraViews;
