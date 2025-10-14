import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// Defer PWA service worker to avoid blocking initial render
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  setTimeout(() => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silent fail - PWA is optional
    });
  }, 3000); // Register after 3 seconds to not block initial load
}

createRoot(document.getElementById("root")!).render(<App />);
