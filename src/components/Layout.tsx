
import { useLocation } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopSidebar from "./DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  // Listen for hover state changes from the sidebar
  const handleSidebarHover = (hovered: boolean) => {
    setIsHovered(hovered);
  };

  // Page transition effect
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gaming-bg flex w-full overflow-hidden">
      {!isMobile && <DesktopSidebar currentPath={currentPath} />}
      
      <div 
        className={`flex-1 w-full transition-all duration-300 ease-in-out ${
          !isMobile ? "lg:ml-16" : ""
        } overflow-hidden`}
      >
        <div className="p-2 sm:p-4 pb-20 md:pb-4 min-h-screen w-full max-w-7xl mx-auto">
          <div className={`w-full overflow-x-hidden transition-opacity duration-300 ${
            isPageTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
          }`}>
            {children}
          </div>
        </div>
      </div>
      
      {isMobile && <MobileNavbar currentPath={currentPath} />}
    </div>
  );
};

export default Layout;
