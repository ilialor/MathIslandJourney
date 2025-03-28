import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { characterHover } from '@/utils/animation-utils';

interface CharacterGuideProps {
  message: string;
}

const CharacterGuide: React.FC<CharacterGuideProps> = ({ message }) => {
  const [showMessage, setShowMessage] = useState(true);
  
  return (
    <motion.div 
      className="character absolute bottom-[10%] left-[42%] w-16 h-24 cursor-pointer"
      initial="initial"
      animate="animate"
      variants={characterHover}
      onClick={() => setShowMessage(!showMessage)}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 150" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, 0)">
          {/* Character body */}
          <ellipse cx="50" cy="115" rx="30" ry="35" fill="#4F8CF6" />
          
          {/* Character head */}
          <circle cx="50" cy="50" r="35" fill="#FFD166" />
          
          {/* Eyes */}
          <circle cx="35" cy="45" r="5" fill="white" />
          <circle cx="65" cy="45" r="5" fill="white" />
          <circle cx="35" cy="45" r="2" fill="#333" />
          <circle cx="65" cy="45" r="2" fill="#333" />
          
          {/* Smile */}
          <path d="M35 65 Q50 80 65 65" stroke="#333" strokeWidth="3" fill="none" />
          
          {/* Arms */}
          <path d="M20 100 Q5 90 10 70" stroke="#4F8CF6" strokeWidth="8" strokeLinecap="round" />
          <path d="M80 100 Q95 90 90 70" stroke="#4F8CF6" strokeWidth="8" strokeLinecap="round" />
        </g>
      </svg>
      
      {showMessage && (
        <motion.div 
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-2 shadow-lg w-32 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-heading">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CharacterGuide;
