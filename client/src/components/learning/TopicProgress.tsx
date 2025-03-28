import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { LearningStep } from '@/types';
import { Check } from 'lucide-react';

interface TopicProgressProps {
  steps: LearningStep[];
  currentStep: number;
}

const TopicProgress: React.FC<TopicProgressProps> = ({ steps, currentStep }) => {
  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>Learning Progress</span>
        <span>{completedSteps}/{steps.length} Steps Completed</span>
      </div>
      
      <Progress value={progressPercentage} className="h-3" />
      
      {/* Steps Indicators */}
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div 
              className={`w-8 h-8 rounded-full ${
                step.isCompleted 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-300 text-gray-600'
              } flex items-center justify-center text-xs`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{step.id}</span>
              )}
            </motion.div>
            <span className="text-xs mt-1">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicProgress;
