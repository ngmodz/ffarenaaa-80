
import { 
  Home, 
  Trophy, 
  Calendar, 
  User, 
  Wallet, 
  Settings, 
  Plus, 
  Menu
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon, label, to, isActive = false, isCollapsed }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-3 rounded-md transition-all",
        isActive ? "bg-gaming-primary/20 text-gaming-primary" : "text-gaming-muted hover:text-gaming-text hover:bg-gaming-card",
        "my-1"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8">
        {icon}
      </div>
      {!isCollapsed && <span className="ml-3 text-sm font-medium">{label}</span>}
    </Link>
  );
};

interface DesktopSidebarProps {
  currentPath: string;
}

const DesktopSidebar = ({ currentPath }: DesktopSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full bg-gaming-card border-r border-gaming-border z-40">
      <div className={cn(
        "transition-all flex flex-col", 
        isCollapsed ? "w-16" : "w-56"
      )}>
        {/* Brand */}
        <div className="p-4 flex items-center">
          <div className="w-8 h-8 bg-gaming-primary rounded-md flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
          {!isCollapsed && <span className="ml-2 font-bold text-lg text-glow">FireArena</span>}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2">
          <SidebarItem 
            icon={<Home size={18} />} 
            label="Home" 
            to="/" 
            isActive={currentPath === "/"} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={<Trophy size={18} />} 
            label="Tournaments" 
            to="/tournaments" 
            isActive={currentPath.startsWith("/tournaments")} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={<Calendar size={18} />} 
            label="Schedule" 
            to="/schedule" 
            isActive={currentPath === "/schedule"} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={<Wallet size={18} />} 
            label="Wallet" 
            to="/wallet" 
            isActive={currentPath === "/wallet"} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={<User size={18} />} 
            label="Profile" 
            to="/profile" 
            isActive={currentPath === "/profile"} 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            to="/settings" 
            isActive={currentPath === "/settings"} 
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Create Tournament Button */}
        <div className="p-3">
          <Link
            to="/create-tournament"
            className={cn(
              "btn-gaming-accent flex items-center justify-center rounded-md",
              isCollapsed ? "p-2" : "px-4 py-2"
            )}
          >
            <Plus size={18} />
            {!isCollapsed && <span className="ml-2">Create Tournament</span>}
          </Link>
        </div>

        {/* Collapse toggle */}
        <div className="px-3 py-2 mt-auto border-t border-gaming-border">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 text-gaming-muted hover:text-gaming-text rounded-md hover:bg-gaming-card"
          >
            <Menu size={18} />
            {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
