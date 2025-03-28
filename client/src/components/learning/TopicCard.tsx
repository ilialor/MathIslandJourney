import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import TopicProgress from './TopicProgress';
import { LearningStep } from '@/types';
import { Topic, Progress } from '@shared/schema';
import { Redo, Play } from 'lucide-react';
import { buttonPress } from '@/utils/animation-utils';
import { Link } from 'wouter';

interface TopicCardProps {
  topic: Topic;
  progress?: Progress;
  onContinue: () => void;
  onRestart: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  progress, 
  onContinue, 
  onRestart 
}) => {
  const getNextStepPath = (): string => {
    if (!progress?.watchCompleted) return `/learn/${topic.id}`;
    if (!progress?.testCompleted) return `/test/${topic.id}`;
    if (!progress?.practiceCompleted) return `/practice/${topic.id}`;
    if (!progress?.teachCompleted) return `/teach/${topic.id}`;
    return `/topic/${topic.id}`;
  };
  
  const steps: LearningStep[] = [
    {
      id: 1,
      name: "Watch",
      icon: "fas fa-play",
      isCompleted: progress?.watchCompleted || false
    },
    {
      id: 2,
      name: "Test",
      icon: "fas fa-check",
      isCompleted: progress?.testCompleted || false
    },
    {
      id: 3,
      name: "Practice",
      icon: "fas fa-hands",
      isCompleted: progress?.practiceCompleted || false
    },
    {
      id: 4,
      name: "Teach",
      icon: "fas fa-chalkboard-teacher",
      isCompleted: progress?.teachCompleted || false
    }
  ];
  
  const currentStep = steps.findIndex(step => !step.isCompleted);
  const nextStepPath = getNextStepPath();
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 bg-[#82D8B9] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-heading font-bold text-3xl text-white">{topic.name.split(' ')[0]}</span>
        </div>
        
        <div className="flex-grow text-center sm:text-left">
          <h3 className="font-heading font-bold text-xl mb-2">{topic.name}</h3>
          <p className="text-gray-600 mb-4">{topic.description}</p>
          
          {/* Learning Path Progress */}
          <TopicProgress steps={steps} currentStep={currentStep !== -1 ? currentStep : steps.length} />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <Link href={nextStepPath}>
              <motion.div {...buttonPress}>
                <Button 
                  className="learn-button bg-primary hover:bg-primary/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
                  onClick={onContinue}
                >
                  <Play className="h-4 w-4" />
                  <span>Continue Learning</span>
                </Button>
              </motion.div>
            </Link>
            
            <motion.div {...buttonPress}>
              <Button 
                variant="outline"
                className="learn-button bg-white hover:bg-gray-50 text-primary font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 border border-primary"
                onClick={onRestart}
              >
                <Redo className="h-4 w-4" />
                <span>Restart Topic</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
