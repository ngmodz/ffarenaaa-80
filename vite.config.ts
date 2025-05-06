
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use componentTagger in development mode, never in production
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add build configuration to inject badge-hiding CSS
  build: {
    rollupOptions: {
      output: {
        // Add custom banner to every generated JS file
        banner: `
          // Hide Lovable badge
          (function() {
            const style = document.createElement('style');
            style.textContent = 
              ".lovable-badge, .lovable-widget, [class*='lovable-'], [id*='lovable-'] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }";
            document.head.appendChild(style);
            
            // Remove badge elements when DOM loads
            document.addEventListener('DOMContentLoaded', function() {
              const removeElements = () => {
                const badges = document.querySelectorAll(".lovable-badge, .lovable-widget, [class*='lovable-'], [id*='lovable-']");
                badges.forEach(el => el.remove());
              };
              removeElements();
              // Try again after a delay to catch dynamically added elements
              setTimeout(removeElements, 1000);
              setTimeout(removeElements, 3000);
            });
          })();
        `,
      }
    }
  }
}));
