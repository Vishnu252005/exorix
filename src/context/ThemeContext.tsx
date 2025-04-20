import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, initializeTheme, setTheme } from '../utils/themeUtils';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  
  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = initializeTheme();
    setThemeState(initialTheme);
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeState(newTheme);
  };
  
  // Derived state
  const isDark = theme === 'dark';
  
  // Context value
  const value = {
    theme,
    toggleTheme,
    isDark
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 