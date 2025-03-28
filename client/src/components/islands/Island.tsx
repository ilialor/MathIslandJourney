import React from 'react';
import { motion } from 'framer-motion';
import { IslandProps } from '@/types';
import { islandHover } from '@/utils/animation-utils';
import { Lock } from 'lucide-react';

const Island: React.FC<IslandProps> = ({ 
  id, 
  name, 
  position, 
  size, 
  colors, 
  isLocked, 
  isActive,
  topic
}) => {
  const islandClasses = isLocked ? 'grayscale opacity-80 cursor-not-allowed' : 'cursor-pointer';
  const circleSize = isActive ? 'w-24 h-24' : isLocked ? 'w-16 h-16' : 'w-20 h-20';
  const textSize = isActive ? 'text-2xl' : 'text-sm';

  return (
    <motion.div 
      className={`absolute island-shadow ${islandClasses}`}
      style={{ 
        ...position,
        width: size.width, 
        height: size.height 
      }}
      data-island={id}
      {...(isLocked ? {} : islandHover)}
    >
      <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M20 100C20 80 40 60 100 60C160 60 180 80 180 100C180 120 160 140 100 140C40 140 20 120 20 100Z" 
          fill={colors.base}
        />
        {colors.middle && (
          <path 
            d="M60 65C60 45 80 30 100 30C120 30 140 45 140 65C140 85 120 100 100 100C80 100 60 85 60 65Z" 
            fill={colors.middle}
          />
        )}
        {colors.top && (
          <path 
            d="M80 40C80 20 90 10 100 10C110 10 120 20 120 40C120 60 110 70 100 70C90 70 80 60 80 40Z" 
            fill={colors.top}
          />
        )}
      </svg>
      
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full ${circleSize} flex flex-col items-center justify-center shadow-lg ${isActive ? 'border-4 border-accent' : ''}`}>
        {isLocked ? (
          <>
            <Lock className="text-gray-400 text-lg mb-1" />
            <span className="font-heading font-bold text-gray-400 text-sm">{name}</span>
          </>
        ) : (
          <>
            <span className={`font-heading font-bold ${textSize} text-primary`}>{topic?.name?.split(' ')[0] || name}</span>
            <span className="text-xs text-gray-600">{name}</span>
            {isActive && (
              <div className="mt-1 flex">
                <i className="fas fa-star text-yellow-400 text-xs"></i>
                <i className="fas fa-star text-yellow-400 text-xs"></i>
                <i className="fas fa-star-half-alt text-yellow-400 text-xs"></i>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Island;
