
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  className?: string;
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  noPadding?: boolean;
  glassmorphic?: boolean;
  highlightColor?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card = ({
  className,
  children,
  title,
  subtitle,
  icon,
  noPadding = false,
  glassmorphic = false,
  highlightColor,
  hoverEffect = false,
  onClick,
}: CardProps) => {
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 10 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    },
    hover: hoverEffect ? { 
      y: -5,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    } : {},
    tap: hoverEffect ? { 
      y: 0,
      transition: { 
        duration: 0.1,
        ease: "easeIn"
      } 
    } : {}
  };

  return (
    <motion.div
      className={cn(
        'rounded-lg overflow-hidden',
        glassmorphic ? 'glass-card backdrop-blur-md border border-white/30' : 'bg-card',
        !noPadding && 'p-6',
        highlightColor && `border-l-4 border-l-[${highlightColor}]`,
        hoverEffect && 'cursor-pointer transition-all',
        'shadow-subtle',
        className
      )}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onClick={onClick}
    >
      {(title || subtitle || icon) && (
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="font-medium text-lg">{title}</h3>}
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
