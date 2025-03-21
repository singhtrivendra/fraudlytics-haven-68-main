
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  seperator?: string;
}

const AnimatedNumber = ({
  value,
  duration = 1.5,
  decimals = 0,
  className,
  prefix = '',
  suffix = '',
  seperator = ','
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setDisplayValue(progress * value);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };
    
    animationFrame = requestAnimationFrame(updateValue);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formatValue = (val: number) => {
    return prefix + val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, seperator) + suffix;
  };

  return (
    <motion.span
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {formatValue(displayValue)}
    </motion.span>
  );
};

export default AnimatedNumber;
