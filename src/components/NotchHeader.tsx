
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
  // We'll use a try-catch to handle potential usage outside Router context
  let pageTitle = title;
  try {
    const location = useLocation();
    const path = location.pathname;

    // Dynamically set the title based on the current route
    if (path === '/') pageTitle = "Free Fire Arena";
    if (path.includes('/tournament/')) pageTitle = "Tournament Details";
    if (path === '/auth') pageTitle = "Authentication";
  } catch (error) {
    // If useLocation fails, we'll fall back to the default title
    console.log("Using default title as Router context not available");
  }

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
        {pageTitle}
      </div>
    </div>
  );
};

export default NotchHeader;
