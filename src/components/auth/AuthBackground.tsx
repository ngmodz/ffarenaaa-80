
import { ReactNode, useEffect } from "react";

interface AuthBackgroundProps {
  children: ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  // Add effect to hide Lovable badge when this component mounts
  useEffect(() => {
    // Function to remove badge elements
    const removeBadgeElements = () => {
      const badgeSelectors = [
        '.lovable-badge',
        '.lovable-widget',
        '[class*="lovable-"]',
        '[id*="lovable-"]',
        'div[style*="z-index: 9999999"]',
        'div[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]',
        'div[style*="position: fixed"][style*="bottom: 16px"][style*="right: 16px"]'
      ];
      
      badgeSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    };
    
    // Run on mount and with timeouts to catch dynamically added elements
    removeBadgeElements();
    const timers = [
      setTimeout(removeBadgeElements, 500),
      setTimeout(removeBadgeElements, 1500),
      setTimeout(removeBadgeElements, 3000)
    ];
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gaming-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gaming-primary/10 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gaming-accent/10 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        {children}
      </div>
      
      <footer className="py-4 text-center text-sm text-gaming-text/50 relative z-10">
        <p>© 2025 Free Fire Tournaments - Not affiliated with Garena</p>
      </footer>
      
      {/* Badge blocker - fixed position div covering the bottom right corner */}
      <div 
        className="fixed bottom-0 right-0 w-[150px] h-[50px] z-[999999]" 
        style={{
          backgroundColor: 'transparent',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default AuthBackground;
