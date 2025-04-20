// This script runs before the React app loads to set dark mode as default
// It prevents the flash of light mode content before React hydrates
(function() {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem('exorix-theme');
  
  // If no theme is stored or it's set to dark, apply dark mode
  if (!storedTheme || storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('exorix-theme', 'dark');
  }
})(); 