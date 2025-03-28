import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VirtualStudentState } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VirtualStudentProps {
  student: VirtualStudentState;
  onUnderstandingUpdate: (understanding: number) => void;
  onMessageUpdate: (message: string) => void;
}

const VirtualStudent: React.FC<VirtualStudentProps> = ({ 
  student, 
  onUnderstandingUpdate,
  onMessageUpdate
}) => {
  // Messages the virtual student might say based on understanding
  const studentMessages = [
    "I don't know how to count yet. Can you teach me?",
    "I'm a bit confused about the order of numbers.",
    "I think I'm starting to understand counting!",
    "I can count to 5 now, but I'm not sure about higher numbers.",
    "I almost got it! Can you show me once more?",
    "I can count from 1 to 10 now! Thank you for teaching me!"
  ];

  // Update message based on understanding level
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(student.understanding / 20),
      studentMessages.length - 1
    );
    if (studentMessages[messageIndex] !== student.message) {
      onMessageUpdate(studentMessages[messageIndex]);
    }
  }, [student.understanding]);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden mb-4"
        whileHover={{ scale: 1.05 }}
      >
        <Avatar className="w-full h-full">
          <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Timmy" alt="Virtual student" />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </motion.div>
      
      <h5 className="font-heading font-bold text-lg mb-2">{student.name}</h5>
      
      <motion.div 
        className="bg-background rounded-lg p-3 mb-4 w-full max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-center text-sm">{student.message}</p>
      </motion.div>
      
      {/* Understanding Meter */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-1 text-sm">
          <span>Understanding:</span>
          <span>{student.understanding}%</span>
        </div>
        <Progress value={student.understanding} className="h-3" />
      </div>
    </div>
  );
};

export default VirtualStudent;
