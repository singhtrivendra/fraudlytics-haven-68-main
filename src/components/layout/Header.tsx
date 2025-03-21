import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Shield, 
  AlertTriangle, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import Badge from '@/components/ui-custom/Badge';
import SearchDialog from '@/components/header/SearchDialog';
import NotificationsDialog from '@/components/header/NotificationsDialog';
import SettingsDialog from '@/components/header/SettingsDialog';
import { testGeminiAPI } from '@/utils/fraudDetection';
import { useToast } from '@/hooks/use-toast';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Header: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <BarChart2 className="w-4 h-4" />
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: 'Rules',
      path: '/rules',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart2 className="w-4 h-4" />
    },
  ];

  React.useEffect(() => {
    const testAPI = async () => {
      const isWorking = await testGeminiAPI();
      if (isWorking) {
        console.log("Gemini API connected successfully");
      } else {
        toast({
          title: "API Connection Error",
          description: "Could not connect to Gemini API. Some features may be limited.",
          variant: "destructive",
        });
      }
    };
    
    testAPI();
  }, [toast]);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: 0.3 + (i * 0.1),
        ease: "easeOut"
      }
    })
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mobileNavItemVariants = {
    closed: { 
      opacity: 0, 
      x: 20 
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="container mx-auto py-3 px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Shield className="w-8 h-8 mr-2 text-primary" />
            <span className="text-xl font-medium tracking-tight">SubPaisa</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div 
                  key={item.path} 
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          )}

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            <motion.button 
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary smooth-transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </motion.button>
            
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary smooth-transition"
                onClick={() => setIsNotificationsOpen(true)}
              >
                <Bell className="w-5 h-5" />
              </button>
              <Badge 
                variant="danger" 
                size="sm" 
                className="absolute -top-1 -right-1" 
                pulsate
              >
                2
              </Badge>
            </motion.div>
            
            <motion.button 
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary smooth-transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <motion.button
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary smooth-transition md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          className={cn(
            "fixed inset-y-0 right-0 w-full max-w-xs bg-background/95 backdrop-blur-md border-l p-6 z-50 overflow-y-auto",
            isMenuOpen ? "block" : "hidden"
          )}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
        >
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <Link to="/" className="flex items-center">
                <Shield className="w-8 h-8 mr-2 text-primary" />
                <span className="text-xl font-medium tracking-tight">SubPaisa</span>
              </Link>
            </div>
            
            <nav className="flex-1">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    variants={mobileNavItemVariants}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </div>
        </motion.div>
      )}

      {/* Dialogs */}
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
      
      <NotificationsDialog 
        open={isNotificationsOpen} 
        onOpenChange={setIsNotificationsOpen} 
      />
      
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </motion.header>
  );
};

export default Header;
