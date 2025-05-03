import { useLocation } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import TopPwaNavbar from "./TopPwaNavbar";
import DesktopSidebar from "./DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [pageTitle, setPageTitle] = useState("Free Fire Arena");

  // Listen for hover state changes from the sidebar
  const handleSidebarHover = (hovered: boolean) => {
    setIsHovered(hovered);
  };

  // Set page title based on current path
  useEffect(() => {
    if (currentPath === "/") {
      setPageTitle("Free Fire Arena");
    } else if (currentPath.startsWith("/tournaments")) {
      setPageTitle("Tournaments");
    } else if (currentPath === "/create-tournament") {
      setPageTitle("Create Tournament");
    } else if (currentPath === "/schedule") {
      setPageTitle("Schedule");
    } else if (currentPath === "/profile") {
      setPageTitle("Profile");
    }
  }, [currentPath]);

  // Page transition effect
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gaming-bg flex w-full overflow-hidden">
      {!isMobile && (
        <DesktopSidebar 
          currentPath={currentPath} 
          onHoverChange={handleSidebarHover}
        />
      )}
      
      {isMobile && <TopPwaNavbar title={pageTitle} />}
      
      <motion.div 
        className={`flex-1 w-full transition-all duration-300 ease-out ${
          !isMobile ? "lg:ml-16" : ""
        } overflow-hidden`}
        animate={{
          marginLeft: !isMobile ? (isHovered ? "14rem" : "4rem") : "0",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <div className={`p-2 sm:p-4 pb-20 md:pb-4 min-h-screen w-full max-w-7xl mx-auto ${
          isMobile ? "pt-14" : ""
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1.0]
              }}
              className="w-full overflow-x-hidden"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      
      {isMobile && <MobileNavbar currentPath={currentPath} />}
    </div>
  );
};

export default Layout;
