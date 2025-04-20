/**
 * Utility to preload important assets before showing the main application
 */

// List of image assets to preload
const imageAssets = [
  // Add your important image assets here
  // Example: '/images/logo.png', '/images/hero-bg.jpg', etc.
];

// List of font assets to preload
const fontAssets = [
  // Add your font assets here if needed
  // Example: '/fonts/inter.woff2', etc.
];

/**
 * Preloads an image and returns a promise
 */
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn(`Failed to preload image: ${src}`);
      resolve(); // Resolve anyway to not block loading
    };
  });
};

/**
 * Preloads a font and returns a promise
 */
const preloadFont = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = src;
    link.onload = () => resolve();
    link.onerror = () => {
      console.warn(`Failed to preload font: ${src}`);
      resolve(); // Resolve anyway to not block loading
    };
    document.head.appendChild(link);
  });
};

/**
 * Preloads all assets and returns a promise
 */
export const preloadAssets = async (): Promise<void> => {
  try {
    // Preload images
    const imagePromises = imageAssets.map(preloadImage);
    
    // Preload fonts
    const fontPromises = fontAssets.map(preloadFont);
    
    // Wait for all assets to load
    await Promise.all([...imagePromises, ...fontPromises]);
    
    // Add a small delay to ensure smooth transition
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('All assets preloaded successfully');
  } catch (error) {
    console.error('Error preloading assets:', error);
  }
};

export default preloadAssets; 