
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
import { useState, useEffect } from "react";
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
  // Always default to collapsed
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // We'll maintain the collapsed state always true at initialization
  useEffect(() => {
    // No need to adjust collapse state based on window size anymore
    // Just ensure it's always collapsed on initial load
    setIsCollapsed(true);
  }, []);

  // Sidebar width is determined by hover state
  const sidebarWidth = isHovered ? "w-56" : "w-16";

  return (
    <div 
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-gaming-card border-r border-gaming-border z-40 ${sidebarWidth} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "transition-all flex flex-col h-full",
        isHovered ? "w-56" : "w-16"
      )}>
        {/* Brand */}
        <div className="p-4 flex items-center">
          <div className="w-8 h-8 bg-gaming-primary rounded-md flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
          {isHovered && <span className="ml-2 font-bold text-lg text-glow">FireArena</span>}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2">
          <SidebarItem 
            icon={<Home size={18} />} 
            label="Home" 
            to="/" 
            isActive={currentPath === "/"} 
            isCollapsed={!isHovered}
          />
          <SidebarItem 
            icon={<Trophy size={18} />} 
            label="Tournaments" 
            to="/tournaments" 
            isActive={currentPath.startsWith("/tournaments")} 
            isCollapsed={!isHovered}
          />
          <SidebarItem 
            icon={<Calendar size={18} />} 
            label="Schedule" 
            to="/schedule" 
            isActive={currentPath === "/schedule"} 
            isCollapsed={!isHovered}
          />
          <SidebarItem 
            icon={<Wallet size={18} />} 
            label="Wallet" 
            to="/wallet" 
            isActive={currentPath === "/wallet"} 
            isCollapsed={!isHovered}
          />
          <SidebarItem 
            icon={<User size={18} />} 
            label="Profile" 
            to="/profile" 
            isActive={currentPath === "/profile"} 
            isCollapsed={!isHovered}
          />
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            to="/settings" 
            isActive={currentPath === "/settings"} 
            isCollapsed={!isHovered}
          />
        </div>

        {/* Create Tournament Button */}
        <div className="p-3">
          <Link
            to="/create-tournament"
            className={cn(
              "btn-gaming-accent flex items-center justify-center rounded-md",
              !isHovered ? "p-2" : "px-4 py-2"
            )}
          >
            <Plus size={18} />
            {isHovered && <span className="ml-2">Create Tournament</span>}
          </Link>
        </div>

        {/* Collapse toggle - removed since we're now always using hover */}
      </div>
    </div>
  );
};

export default DesktopSidebar;
