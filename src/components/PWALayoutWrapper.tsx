
import React from 'react';
import NotchHeader from './NotchHeader';

interface PWALayoutWrapperProps {
  children: React.ReactNode;
}

const PWALayoutWrapper: React.FC<PWALayoutWrapperProps> = ({ children }) => {
  return (
    <>
      <NotchHeader />
      {children}
    </>
  );
};

export default PWALayoutWrapper;
