/**
 * Utility functions for theme management
 */

// Theme options
export type Theme = 'dark' | 'light';

// Local storage key for theme
const THEME_STORAGE_KEY = 'exorix-theme';

/**
 * Initialize theme based on stored preference or set dark as default
 */
export const initializeTheme = (): Theme => {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  
  if (storedTheme) {
    // Use stored theme preference
    setTheme(storedTheme);
    return storedTheme;
  }
  
  // Set dark mode as default
  setTheme('dark');
  return 'dark';
};

/**
 * Set theme and save to localStorage
 */
export const setTheme = (theme: Theme): void => {
  // Save to localStorage
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Apply theme to document
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = (): Theme => {
  const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  setTheme(newTheme);
  return newTheme;
};

export default {
  initializeTheme,
  setTheme,
  toggleTheme
}; 