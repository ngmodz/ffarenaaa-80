
import { useLocation } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopSidebar from "./DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gaming-bg flex w-full">
      {!isMobile && <DesktopSidebar currentPath={currentPath} />}
      
      <div className={`flex-1 w-full ${!isMobile ? "lg:ml-16 xl:ml-56" : ""}`}>
        <div className="p-2 sm:p-4 pb-20 md:pb-4 min-h-screen w-full max-w-7xl mx-auto">
          <div className="w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
      
      {isMobile && <MobileNavbar currentPath={currentPath} />}
    </div>
  );
};

export default Layout;
