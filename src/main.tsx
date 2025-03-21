
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize dark mode based on user preference
const initializeDarkMode = () => {
  // Check if user has a saved preference
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode === 'true') {
    document.documentElement.classList.add('dark');
  } else if (savedDarkMode === null) {
    // If no saved preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
  }
};

// Run dark mode initialization
initializeDarkMode();

createRoot(document.getElementById("root")!).render(<App />);
