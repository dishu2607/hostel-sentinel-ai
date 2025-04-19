
import { useState } from "react";
import { Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [alertCount, setAlertCount] = useState(5);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Hostel Sentinel</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </Button>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-2">
                <User className="h-4 w-4" />
              </div>
              <span>Admin</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
