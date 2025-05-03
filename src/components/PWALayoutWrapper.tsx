
import React from 'react';
import NotchHeader from './NotchHeader';

interface PWALayoutWrapperProps {
  children: React.ReactNode;
}

const PWALayoutWrapper: React.FC<PWALayoutWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gaming-bg flex flex-col">
      <NotchHeader />
      <div className="flex-1 pt-[calc(env(safe-area-inset-top)+48px)]">
        {children}
      </div>
    </div>
  );
};

export default PWALayoutWrapper;
