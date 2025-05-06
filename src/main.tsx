
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import './ios-font.css'
import './index.css'
import { registerServiceWorker } from './registerSW'

// Function to hide Lovable badge
const hideLovableBadge = () => {
  // Create style tag to hide badge
  const style = document.createElement('style');
  style.textContent = `
    .lovable-badge, 
    .lovable-widget, 
    [class*='lovable-'], 
    [id*='lovable-'],
    div[style*='z-index: 9999999'],
    div[style*='position: fixed'][style*='bottom: 0'][style*='right: 0'],
    div[style*='position: fixed'][style*='bottom: 16px'][style*='right: 16px'] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
  
  // Function to remove badge elements
  const removeBadgeElements = () => {
    // Target common selectors for the badge
    const selectors = [
      '.lovable-badge',
      '.lovable-widget',
      '[class*="lovable-"]',
      '[id*="lovable-"]',
      'div[style*="z-index: 9999999"]',
      'div[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]',
      'div[style*="position: fixed"][style*="bottom: 16px"][style*="right: 16px"]'
    ];
    
    // Try each selector
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    // Look for fixed position elements in the bottom right corner
    document.querySelectorAll('div').forEach(div => {
      const style = window.getComputedStyle(div);
      if (
        style.position === 'fixed' && 
        (style.bottom === '0px' || style.bottom === '16px') && 
        (style.right === '0px' || style.right === '16px')
      ) {
        div.remove();
      }
    });
  };
  
  // Run once immediately
  removeBadgeElements();
  
  // Run again after DOM content loaded
  document.addEventListener('DOMContentLoaded', () => {
    removeBadgeElements();
    // Try multiple times to catch dynamically added badges
    setTimeout(removeBadgeElements, 500);
    setTimeout(removeBadgeElements, 1500);
    setTimeout(removeBadgeElements, 3000);
  });
  
  // Create overlay to physically block the badge position
  const createBlockingOverlay = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '0';
    overlay.style.right = '0';
    overlay.style.width = '150px';
    overlay.style.height = '40px';
    overlay.style.zIndex = '999999';
    overlay.style.backgroundColor = 'transparent';
    document.body.appendChild(overlay);
  };
  
  // Add blocking overlay after a delay
  setTimeout(createBlockingOverlay, 1000);
};

// Run badge hiding function
hideLovableBadge();

// Set up mutation observer to continuously remove badge
const setupBadgeObserver = () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            const el = node as Element;
            if (
              el.className?.includes?.('lovable') || 
              el.id?.includes?.('lovable') ||
              (el.tagName === 'DIV' && el.hasAttribute('style') && 
               (el.getAttribute('style')?.includes('z-index: 999999') || 
                (el.getAttribute('style')?.includes('position: fixed') && 
                 el.getAttribute('style')?.includes('bottom') && 
                 el.getAttribute('style')?.includes('right'))))
            ) {
              el.remove();
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
};

// Start observer after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupBadgeObserver);
} else {
  setupBadgeObserver();
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

registerServiceWorker();
