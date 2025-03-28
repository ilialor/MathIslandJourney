import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TeachingTool } from '@/types';
import { Button } from '@/components/ui/button';
import { Play, HelpCircle, CheckSquare } from 'lucide-react';
import { buttonPress } from '@/utils/animation-utils';
import { useToast } from '@/hooks/use-toast';

interface TeachingToolsProps {
  onToolUse: (toolId: string, action: string) => void;
  onUnderstandingIncrease: (amount: number) => void;
}

const TeachingTools: React.FC<TeachingToolsProps> = ({ 
  onToolUse,
  onUnderstandingIncrease
}) => {
  const { toast } = useToast();
  const [tools, setTools] = useState<TeachingTool[]>([
    {
      id: 'numberLine',
      name: 'Number Line',
      type: 'numberLine',
      isActive: false
    },
    {
      id: 'countingObjects',
      name: 'Counting Objects',
      type: 'countingObjects',
      isActive: false
    }
  ]);
  
  const toggleTool = (toolId: string) => {
    setTools(tools => 
      tools.map(tool => 
        tool.id === toolId 
          ? { ...tool, isActive: !tool.isActive } 
          : tool
      )
    );
    
    onToolUse(toolId, 'toggle');
    
    // Increment understanding a little bit when showing tools
    onUnderstandingIncrease(2);
  };
  
  const handleCountOutLoud = () => {
    toast({
      title: "Counting Out Loud",
      description: "You counted from 1 to 10 clearly. Timmy is following along!"
    });
    
    onToolUse('audio', 'countOutLoud');
    onUnderstandingIncrease(15);
  };
  
  const handleAskQuestion = () => {
    toast({
      title: "You asked",
      description: "\"Can you tell me which number comes after 5?\" Timmy is thinking..."
    });
    
    onToolUse('interaction', 'askQuestion');
    onUnderstandingIncrease(5);
  };
  
  const handlePracticeCounting = () => {
    toast({
      title: "Practice Session",
      description: "You guided Timmy through a practice session. He's getting better!"
    });
    
    onToolUse('interaction', 'practiceCounting');
    onUnderstandingIncrease(20);
  };
  
  return (
    <div className="md:w-2/3 bg-gray-50 rounded-xl p-4">
      <h5 className="font-heading font-bold text-lg mb-4">Teaching Tools</h5>
      
      {/* Number Line Tool */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-heading font-semibold">Number Line</span>
          <Button 
            variant="link" 
            className="text-primary text-sm p-0"
            onClick={() => toggleTool('numberLine')}
          >
            {tools[0].isActive ? 'Hide' : 'Show'}
          </Button>
        </div>
        
        {tools[0].isActive && (
          <motion.div 
            className="flex justify-between bg-white rounded-lg p-3 shadow-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(10)].map((_, index) => (
              <motion.div 
                key={index} 
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                {index + 1}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Counting Objects Tool */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-heading font-semibold">Counting Objects</span>
          <Button 
            variant="link" 
            className="text-primary text-sm p-0"
            onClick={() => toggleTool('countingObjects')}
          >
            {tools[1].isActive ? 'Hide' : 'Show'}
          </Button>
        </div>
        
        {tools[1].isActive && (
          <motion.div 
            className="bg-white rounded-lg p-3 shadow-sm flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(10)].map((_, index) => (
              <motion.div 
                key={index} 
                className="w-12 h-12 flex items-center justify-center"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C16 2 8 3 8 16C8 29 16 30 16 30C16 30 24 29 24 16C24 3 16 2 16 2Z" fill="#FF5252"/>
                  <path d="M16 5C16 5 16 2 16 2C16 2 8 3 8 16C8 16.6 8.02 17.2 8.05 17.75C10.1 16.05 12.9 15 16 15C19.1 15 21.9 16.05 23.95 17.75C23.98 17.2 24 16.6 24 16C24 3 16 2 16 2C16 2 16 5 16 5Z" fill="#E53935"/>
                  <path d="M16 5V2M16 2C16 2 8 3 8 16C8 29 16 30 16 30C16 30 24 29 24 16C24 3 16 2 16 2Z" stroke="#8C0000" strokeWidth="2"/>
                  <path d="M16 15V10" stroke="#8C0000" strokeWidth="2"/>
                  <path d="M20 13H18C17.4477 13 17 12.5523 17 12V10.5C17 9.94772 17.4477 9.5 18 9.5H20C20.5523 9.5 21 9.94772 21 10.5V12C21 12.5523 20.5523 13 20 13Z" fill="#8BC34A"/>
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Teaching Actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <motion.div {...buttonPress}>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-heading font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            onClick={handleCountOutLoud}
          >
            <Play className="h-4 w-4" />
            <span>Count Out Loud</span>
          </Button>
        </motion.div>
        
        <motion.div {...buttonPress}>
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-white font-heading font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            onClick={handleAskQuestion}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Ask a Question</span>
          </Button>
        </motion.div>
        
        <motion.div {...buttonPress}>
          <Button 
            className="bg-accent hover:bg-accent/90 text-white font-heading font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            onClick={handlePracticeCounting}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Practice Counting</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TeachingTools;
