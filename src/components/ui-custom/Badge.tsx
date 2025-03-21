
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  pulsate?: boolean;
}

const Badge = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  pulsate = false,
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-primary/15 text-primary',
    success: 'bg-safe-light text-safe-dark',
    warning: 'bg-alert-light text-alert-dark',
    danger: 'bg-fraud-light text-fraud-dark',
    info: 'bg-blue-50 text-blue-700',
    outline: 'bg-transparent border border-gray-200 text-gray-800',
    ghost: 'bg-transparent text-gray-500',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const pulseAnimation = pulsate ? {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.85, 1, 0.85],
      transition: {
        repeat: Infinity,
        duration: 2,
      },
    },
  } : {};

  return (
    <motion.span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        ...pulseAnimation.animate
      }}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
