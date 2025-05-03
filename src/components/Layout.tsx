
import { useLocation } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopSidebar from "./DesktopSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gaming-bg flex">
      <DesktopSidebar currentPath={currentPath} />
      
      <div className="flex-1 lg:ml-16 xl:ml-56">
        <div className="p-4 pb-24 lg:pb-4 min-h-screen">
          {children}
        </div>
      </div>
      
      <MobileNavbar currentPath={currentPath} />
    </div>
  );
};

export default Layout;
