
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
        "flex flex-col items-center justify-center text-2xs font-medium transition-colors duration-300",
        isActive ? "text-gaming-primary" : "text-gaming-muted hover:text-gaming-text",
        "px-1 py-1 w-full"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full mb-0.5 transition-all duration-300",
          isHighlighted 
            ? "bg-gaming-accent animate-pulse-glow" 
            : isActive 
              ? "bg-gaming-primary/20 transform hover:scale-110" 
              : "bg-gaming-card hover:bg-gaming-card/80"
        )}
      >
        {icon}
      </div>
      <span className="truncate text-[10px] sm:text-xs transition-all duration-300">{label}</span>
    </Link>
  );
};

interface MobileNavbarProps {
  currentPath: string;
}

const MobileNavbar = ({ currentPath }: MobileNavbarProps) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gaming-bg/90 border-t border-gaming-border backdrop-blur-lg transform transition-transform duration-300">
      <nav className="grid grid-cols-5 max-w-md mx-auto">
        {[
          { icon: <Home size={16} className="transition-transform duration-300 hover:scale-110" />, label: "Home", to: "/", isActive: currentPath === "/" },
          { icon: <Trophy size={16} className="transition-transform duration-300 hover:scale-110" />, label: "Tournaments", to: "/tournaments", isActive: currentPath.startsWith("/tournaments") },
          { icon: <Plus size={16} className="transition-transform duration-300 hover:scale-110" />, label: "Create", to: "/create-tournament", isHighlighted: true },
          { icon: <Calendar size={16} className="transition-transform duration-300 hover:scale-110" />, label: "Schedule", to: "/schedule", isActive: currentPath === "/schedule" },
          { icon: <User size={16} className="transition-transform duration-300 hover:scale-110" />, label: "Profile", to: "/profile", isActive: currentPath === "/profile" }
        ].map((item, index) => (
          <div key={item.to} className={`transform transition-all duration-300 delay-[${index * 50}ms]`}>
            <NavItem 
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={item.isActive}
              isHighlighted={item.isHighlighted}
            />
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavbar;
