
import { Home, Trophy, Calendar, User, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  isHighlighted?: boolean;
}

const NavItem = ({ icon, label, to, isActive = false, isHighlighted = false }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center text-2xs font-medium transition-colors",
        isActive ? "text-gaming-primary" : "text-gaming-muted hover:text-gaming-text",
        "px-1 py-1 w-full"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-1 transition-all",
          isHighlighted 
            ? "bg-gaming-accent animate-pulse-glow" 
            : isActive 
              ? "bg-gaming-primary/20" 
              : "bg-gaming-card"
        )}
      >
        {icon}
      </div>
      <span className="truncate text-xs">{label}</span>
    </Link>
  );
};

interface MobileNavbarProps {
  currentPath: string;
}

const MobileNavbar = ({ currentPath }: MobileNavbarProps) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gaming-bg/90 border-t border-gaming-border backdrop-blur-lg">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        <NavItem 
          icon={<Home size={18} />} 
          label="Home" 
          to="/" 
          isActive={currentPath === "/"} 
        />
        <NavItem 
          icon={<Trophy size={18} />} 
          label="Tournaments" 
          to="/tournaments"
          isActive={currentPath.startsWith("/tournaments")} 
        />
        <NavItem 
          icon={<Plus size={18} />} 
          label="Create" 
          to="/create-tournament" 
          isHighlighted={true}
        />
        <NavItem 
          icon={<Calendar size={18} />} 
          label="Schedule" 
          to="/schedule"
          isActive={currentPath === "/schedule"} 
        />
        <NavItem 
          icon={<User size={18} />} 
          label="Profile" 
          to="/profile"
          isActive={currentPath === "/profile"} 
        />
      </div>
    </div>
  );
};

export default MobileNavbar;
