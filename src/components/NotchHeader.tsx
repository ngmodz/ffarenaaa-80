
import React from 'react';
import { useLocation } from 'react-router-dom';

interface NotchHeaderProps {
  title?: string;
  backgroundColor?: string;
}

const NotchHeader: React.FC<NotchHeaderProps> = ({ 
  title = "Free Fire Arena",
  backgroundColor = "#172554" // Dark blue that matches the app theme
}) => {
  const location = useLocation();
  const path = location.pathname;

  // Dynamically set the title based on the current route
  const getPageTitle = () => {
    if (path === '/') return "Free Fire Arena";
    if (path.includes('/tournament/')) return "Tournament Details";
    if (path === '/auth') return "Authentication";
    return title;
  };

  return (
    <div 
      className="w-full fixed top-0 left-0 z-50"
      style={{
        backgroundColor,
        paddingTop: 'env(safe-area-inset-top)',
        height: 'calc(env(safe-area-inset-top) + 0px)' // Just enough height for the notch
      }}
      aria-hidden="true"
    >
      <div className="text-white text-center text-xs opacity-0">
        {getPageTitle()}
      </div>
    </div>
  );
};

export default NotchHeader;
