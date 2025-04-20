import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  finishLoading: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ finishLoading }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Ensure dark mode is applied during loading
    document.documentElement.classList.add('dark');
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 150);

    // Simulate loading time (minimum 2 seconds for animation to complete)
    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          finishLoading();
        }, 500); // Wait for exit animation
      }, 500); // Wait a bit after progress reaches 100%
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [finishLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative flex flex-col items-center">
            {/* Star field background */}
            <div className="absolute inset-0 -z-10">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-indigo-400"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Logo */}
            <motion.div
              className="relative w-32 h-32 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Outer circle */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-indigo-400"
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    "0 0 0 rgba(79, 70, 229, 0)",
                    "0 0 20px rgba(79, 70, 229, 0.5)",
                    "0 0 0 rgba(79, 70, 229, 0)"
                  ]
                }}
                transition={{ 
                  rotate: { duration: 8, ease: "linear", repeat: Infinity },
                  boxShadow: { duration: 2, ease: "easeInOut", repeat: Infinity }
                }}
              />

              {/* Inner circle with star */}
              <div className="absolute inset-4 rounded-full bg-indigo-600 flex items-center justify-center">
                <motion.div
                  className="text-white text-4xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                >
                  ✦
                </motion.div>
              </div>

              {/* Orbiting stars */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-white flex items-center justify-center"
                  style={{ 
                    originX: "16rem",
                    originY: "16rem",
                  }}
                  animate={{ 
                    rotate: 360,
                    boxShadow: [
                      "0 0 4px rgba(255, 255, 255, 0.5)",
                      "0 0 8px rgba(255, 255, 255, 0.8)",
                      "0 0 4px rgba(255, 255, 255, 0.5)"
                    ]
                  }}
                  transition={{ 
                    rotate: { 
                      duration: 3 + i, 
                      ease: "linear", 
                      repeat: Infinity,
                      delay: i * 0.5
                    },
                    boxShadow: { 
                      duration: 1.5, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      delay: i * 0.2
                    }
                  }}
                >
                  <span className="text-xs">★</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-indigo-400 mb-2">
                Exorix Studio
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-4">
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                />
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
                />
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
                />
              </div>
              
              {/* Progress bar */}
              <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4 mb-6">
                <motion.div
                  className="h-full bg-indigo-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              
              <p className="text-gray-300">
                Elevating digital experiences
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 