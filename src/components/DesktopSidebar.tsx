
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
        "flex items-center px-3 py-3 rounded-md transition-all duration-300",
        isActive ? "bg-gaming-primary/20 text-gaming-primary" : "text-gaming-muted hover:text-gaming-text hover:bg-gaming-card",
        "my-1"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8",
        "transition-all duration-300 transform",
        isActive && "scale-110"
      )}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 animate-in">
          {label}
        </span>
      )}
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
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-gaming-card border-r border-gaming-border z-40 ${sidebarWidth} transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "transition-all duration-300 flex flex-col h-full",
        isHovered ? "w-56" : "w-16"
      )}>
        {/* Brand */}
        <div className="p-4 flex items-center group">
          <div className={cn(
            "w-8 h-8 bg-gaming-primary rounded-md flex items-center justify-center",
            "transition-all duration-300",
            isHovered && "shadow-glow"
          )}>
            <Trophy size={18} className={cn(
              "text-white",
              "transition-transform duration-500",
              isHovered && "animate-pulse"
            )} />
          </div>
          {isHovered && (
            <span className="ml-2 font-bold text-lg text-glow opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              FireArena
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2">
          {[
            { icon: <Home size={18} className="transition-transform duration-300 hover:scale-110" />, label: "Home", to: "/", isActive: currentPath === "/" },
            { icon: <Trophy size={18} className="transition-transform duration-300 hover:scale-110" />, label: "Tournaments", to: "/tournaments", isActive: currentPath.startsWith("/tournaments") },
            { icon: <Calendar size={18} className="transition-transform duration-300 hover:scale-110" />, label: "Schedule", to: "/schedule", isActive: currentPath === "/schedule" },
            { icon: <Wallet size={18} className="transition-transform duration-300 hover:scale-110" />, label: "Wallet", to: "/wallet", isActive: currentPath === "/wallet" },
            { icon: <User size={18} className="transition-transform duration-300 hover:scale-110" />, label: "Profile", to: "/profile", isActive: currentPath === "/profile" },
            { icon: <Settings size={18} className="transition-transform duration-300 hover:scale-110" />, label: "Settings", to: "/settings", isActive: currentPath === "/settings" }
          ].map((item, index) => (
            <div key={item.to} className={cn(
              "opacity-0 transform translate-y-2 group",
              "animate-in transition-all duration-300",
              `delay-[${index * 50}ms]`,
              "opacity-100 translate-y-0"
            )}>
              <SidebarItem 
                icon={item.icon} 
                label={item.label} 
                to={item.to} 
                isActive={item.isActive} 
                isCollapsed={!isHovered}
              />
            </div>
          ))}
        </div>

        {/* Create Tournament Button */}
        <div className="p-3">
          <Link
            to="/create-tournament"
            className={cn(
              "btn-gaming-accent flex items-center justify-center rounded-md",
              "transition-all duration-300 hover:shadow-glow-accent transform hover:translate-y-[-2px]",
              !isHovered ? "p-2" : "px-4 py-2"
            )}
          >
            <Plus size={18} className="transition-transform duration-300" />
            {isHovered && <span className="ml-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">Create Tournament</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
