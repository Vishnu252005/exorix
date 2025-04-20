import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

export const rotateIn = {
  hidden: { opacity: 0, rotate: -5 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

// Reusable animation components
interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export const FadeIn: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={fadeIn}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInUp: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={fadeInUp}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInDown: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={fadeInDown}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInLeft: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={fadeInLeft}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInRight: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={fadeInRight}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<AnimationProps> = ({ 
  children, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<AnimationProps> = ({ 
  children, 
  className = ""
}) => (
  <motion.div
    variants={fadeInUp}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={scaleIn}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const RotateIn: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  once = true,
  amount = 0.2
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={rotateIn}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hover animations
interface HoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  rotate?: number;
}

export const HoverScale: React.FC<HoverProps> = ({ 
  children, 
  className = "",
  scale = 1.05
}) => (
  <motion.div
    whileHover={{ scale }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverRotate: React.FC<HoverProps> = ({ 
  children, 
  className = "",
  rotate = 5
}) => (
  <motion.div
    whileHover={{ rotate }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverElevate: React.FC<HoverProps> = ({ 
  children, 
  className = ""
}) => (
  <motion.div
    whileHover={{ 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Button animation
export const AnimatedButton: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  className = ""
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={className}
  >
    {children}
  </motion.button>
); 