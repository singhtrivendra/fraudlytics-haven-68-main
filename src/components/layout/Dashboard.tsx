
import React, { ReactNode } from 'react';
import Header from './Header';
import { motion } from 'framer-motion';

interface DashboardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  children,
  title,
  subtitle 
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <motion.h1 
                  className="text-3xl font-semibold tracking-tight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {title}
                </motion.h1>
              )}
              
              {subtitle && (
                <motion.p 
                  className="text-muted-foreground mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
