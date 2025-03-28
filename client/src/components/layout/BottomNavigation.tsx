import React from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Map, BookOpen, Gamepad, Trophy, User } from 'lucide-react';
import { NavItem } from '@/types';

export default function BottomNavigation() {
  const [location] = useLocation();
  
  const navItems: NavItem[] = [
    {
      icon: 'map',
      label: 'Map',
      path: '/',
      isActive: location === '/',
    },
    {
      icon: 'learn',
      label: 'Learn',
      path: '/learn/1', // Default to topic ID 1 for the Numbers topic
      isActive: location.includes('/learn') || location.includes('/practice') || location.includes('/teach'),
    },
    {
      icon: 'play',
      label: 'Play',
      path: '/play',
      isActive: location === '/play',
    },
    {
      icon: 'rewards',
      label: 'Rewards',
      path: '/rewards',
      isActive: location === '/rewards',
    },
    {
      icon: 'profile',
      label: 'Profile',
      path: '/profile',
      isActive: location === '/profile',
    },
  ];

  const getIcon = (icon: string, isActive: boolean) => {
    const activeClass = isActive ? 'text-primary' : 'text-gray-500';
    
    switch (icon) {
      case 'map':
        return <Map className={`text-xl mb-1 ${activeClass}`} />;
      case 'learn':
        return <BookOpen className={`text-xl mb-1 ${activeClass}`} />;
      case 'play':
        return <Gamepad className={`text-xl mb-1 ${activeClass}`} />;
      case 'rewards':
        return <Trophy className={`text-xl mb-1 ${activeClass}`} />;
      case 'profile':
        return <User className={`text-xl mb-1 ${activeClass}`} />;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <motion.button
                className={`py-4 px-2 flex flex-col items-center ${
                  item.isActive ? 'text-primary' : 'text-gray-500'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {getIcon(item.icon, item.isActive)}
                <span className="text-xs font-heading">{item.label}</span>
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
