
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Eye, Bell, Video, BarChart2, Settings } from "lucide-react";

const navItems = [
  { title: "Dashboard", icon: Eye, path: "/" },
  { title: "Camera Views", icon: Video, path: "/cameras" },
  { title: "Alerts", icon: Bell, path: "/alerts" },
  { title: "Analytics", icon: BarChart2, path: "/analytics" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Sentinel AI</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Hostel Security System</p>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={cn(
                  "flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  location.pathname === item.path && "bg-gray-100 dark:bg-gray-700 text-primary border-l-4 border-primary"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 p-6 w-64">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-600 dark:text-blue-400">Alert Status</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">System monitoring active</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
