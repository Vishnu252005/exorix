import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BackgroundAnimationProps {
  variant?: 'default' | 'gradient' | 'particles' | 'waves';
  className?: string;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Particles animation
  useEffect(() => {
    if (variant !== 'particles' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    let animationFrameId: number;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.5 + 0.1})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles
    const init = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(150, 150, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);
  
  // Render different background variants
  if (variant === 'particles') {
    return (
      <canvas 
        ref={canvasRef} 
        className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
      />
    );
  }
  
  if (variant === 'gradient') {
    return (
      <motion.div 
        className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
        style={{
          background: 'linear-gradient(45deg, #4f46e5, #7c3aed, #2563eb)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    );
  }
  
  if (variant === 'waves') {
    return (
      <div className={`fixed top-0 left-0 w-full h-full overflow-hidden -z-10 ${className}`}>
        <svg
          className="absolute bottom-0 left-0 w-full h-56 md:h-96 opacity-20 dark:opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <motion.path
              id="wave-path"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              animate={{
                d: [
                  "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
                  "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
                  "M-160 34c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
                  "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </defs>
          <motion.g className="waves">
            <use
              xlinkHref="#wave-path"
              x="48"
              y="0"
              fill="rgba(79, 70, 229, 0.7)"
            />
            <use
              xlinkHref="#wave-path"
              x="48"
              y="3"
              fill="rgba(79, 70, 229, 0.5)"
            />
            <use
              xlinkHref="#wave-path"
              x="48"
              y="5"
              fill="rgba(79, 70, 229, 0.3)"
            />
            <use xlinkHref="#wave-path" x="48" y="7" fill="rgba(79, 70, 229, 0.2)" />
          </motion.g>
        </svg>
      </div>
    );
  }
  
  // Default floating shapes
  return (
    <div className={`fixed top-0 left-0 w-full h-full overflow-hidden -z-10 ${className}`}>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500 dark:bg-indigo-600 opacity-10 dark:opacity-20"
          style={{
            width: Math.random() * 200 + 50,
            height: Math.random() * 200 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation; 