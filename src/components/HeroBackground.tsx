import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let stars: Star[] = [];

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(); // Reinitialize stars when resizing
    };

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Star class
    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      originalX: number;
      originalY: number;

      constructor() {
        this.z = Math.random() * 1000;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 2 + 0.5;
        
        // Create a color palette of blues, purples, and cyans
        const colors = [
          'rgba(79, 70, 229, 0.8)', // Indigo
          'rgba(124, 58, 237, 0.8)', // Purple
          'rgba(37, 99, 235, 0.8)', // Blue
          'rgba(6, 182, 212, 0.8)',  // Cyan
          'rgba(167, 139, 250, 0.8)' // Lavender
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Move stars based on mouse position
        const dx = mouseX - canvas.width / 2;
        const dy = mouseY - canvas.height / 2;
        
        // Parallax effect - stars further away (higher z) move less
        const factor = 0.005 / (this.z * 0.001);
        this.x = this.originalX - dx * factor;
        this.y = this.originalY - dy * factor;
        
        // Twinkle effect
        this.size = Math.random() * 2 + 0.5 + Math.sin(Date.now() * 0.001 + this.z) * 0.5;
        
        // Reset if star goes off screen
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.originalX = this.x;
          this.originalY = this.y;
        }
      }

      draw() {
        if (!ctx) return;
        
        // Draw star with glow effect
        const glow = this.size * 2;
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glow
        );
        
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glow, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize stars
    const initStars = () => {
      stars = [];
      const starCount = Math.min(Math.floor(window.innerWidth / 5), 200);
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Set up event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initialize and start animation
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 z-10" />
      
      {/* Animated shapes */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500 dark:bg-indigo-600 opacity-10 dark:opacity-20 blur-xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBackground; 