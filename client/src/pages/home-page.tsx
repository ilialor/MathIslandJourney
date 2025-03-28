import React, { useEffect } from 'react';
import RootLayout from '@/components/layout/RootLayout';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/animation-utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [location, setLocation] = useLocation();
  
  // Navigate to the navigation view
  const goToNavigationView = () => {
    setLocation('/navigation');
  };
  
  return (
    <RootLayout>
      <motion.div 
        className="py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[80vh]"
        {...fadeIn}
      >
        <motion.h1 
          className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-text-dark mb-4 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to Math Adventure Islands!
        </motion.h1>
        
        <motion.p
          className="text-center text-gray-600 max-w-xl mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          An interactive journey through elementary math concepts.
          Explore islands, complete challenges, and master math in a fun way!
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
            onClick={goToNavigationView}
          >
            <span>Start Your Adventure</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </RootLayout>
  );
}
