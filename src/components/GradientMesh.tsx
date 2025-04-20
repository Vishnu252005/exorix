import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GradientMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* SVG Gradient Mesh */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <motion.stop
              offset="0%"
              stopColor="#4f46e5"
              animate={{ stopColor: ['#4f46e5', '#7c3aed', '#2563eb', '#4f46e5'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.stop
              offset="100%"
              stopColor="#7c3aed"
              animate={{ stopColor: ['#7c3aed', '#2563eb', '#4f46e5', '#7c3aed'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <motion.stop
              offset="0%"
              stopColor="#2563eb"
              animate={{ stopColor: ['#2563eb', '#4f46e5', '#7c3aed', '#2563eb'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.stop
              offset="100%"
              stopColor="#4f46e5"
              animate={{ stopColor: ['#4f46e5', '#7c3aed', '#2563eb', '#4f46e5'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Animated Blobs */}
        <g className="opacity-30 dark:opacity-20">
          <motion.path
            d="M0,0 C150,150 300,0 450,150 C600,300 750,150 900,300 C1050,450 1200,300 1350,450 L1350,700 L0,700 Z"
            fill="url(#gradient1)"
            filter="url(#glow)"
            animate={{
              d: [
                "M0,0 C150,150 300,0 450,150 C600,300 750,150 900,300 C1050,450 1200,300 1350,450 L1350,700 L0,700 Z",
                "M0,0 C150,50 300,100 450,50 C600,0 750,50 900,0 C1050,50 1200,100 1350,50 L1350,700 L0,700 Z",
                "M0,0 C150,100 300,50 450,100 C600,150 750,100 900,150 C1050,200 1200,150 1350,200 L1350,700 L0,700 Z",
                "M0,0 C150,150 300,0 450,150 C600,300 750,150 900,300 C1050,450 1200,300 1350,450 L1350,700 L0,700 Z",
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.path
            d="M0,350 C150,200 300,350 450,200 C600,50 750,200 900,50 C1050,0 1200,50 1350,0 L1350,700 L0,700 Z"
            fill="url(#gradient2)"
            filter="url(#glow)"
            animate={{
              d: [
                "M0,350 C150,200 300,350 450,200 C600,50 750,200 900,50 C1050,0 1200,50 1350,0 L1350,700 L0,700 Z",
                "M0,250 C150,300 300,250 450,300 C600,350 750,300 900,350 C1050,400 1200,350 1350,400 L1350,700 L0,700 Z",
                "M0,300 C150,250 300,300 450,250 C600,200 750,250 900,200 C1050,150 1200,200 1350,150 L1350,700 L0,700 Z",
                "M0,350 C150,200 300,350 450,200 C600,50 750,200 900,50 C1050,0 1200,50 1350,0 L1350,700 L0,700 Z",
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </g>
        
        {/* Grid Pattern Overlay */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" className="opacity-30 dark:opacity-10" />
      </svg>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white dark:bg-indigo-400 opacity-40 dark:opacity-30"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 z-10" />
    </div>
  );
};

export default GradientMesh; 