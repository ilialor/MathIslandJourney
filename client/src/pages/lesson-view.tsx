import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Topic } from '@shared/schema';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeIn, slideUp, buttonPress } from '@/utils/animation-utils';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const topicId = parseInt(id);
  const [location, setLocation] = useLocation();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { toast } = useToast();
  
  // Fetch topic details
  const { 
    data: topic,
    isLoading: isLoadingTopic
  } = useQuery<Topic>({
    queryKey: [`/api/topics/${topicId}`],
  });
  
  // Lesson data for different topics
  const lessonContent = {
    // Topic 1: Counting Numbers 1-10
    1: [
      { number: 1, description: "This is the number one. It looks like a straight line." },
      { number: 2, description: "This is the number two. It has a curve and a flat bottom." },
      { number: 3, description: "This is the number three. It has two curves." },
      { number: 4, description: "This is the number four. It has two straight lines and a connecting line." },
      { number: 5, description: "This is the number five. It has a line and a curve." },
      { number: 6, description: "This is the number six. It has a big curve." },
      { number: 7, description: "This is the number seven. It has two straight lines." },
      { number: 8, description: "This is the number eight. It looks like two circles on top of each other." },
      { number: 9, description: "This is the number nine. It has a circle and a straight line." },
      { number: 10, description: "This is the number ten. It's made up of a one and a zero next to each other." },
    ],
    // Topic 2: Numbers 11-20
    2: [
      { number: 11, description: "This is the number eleven. It's made up of two ones next to each other." },
      { number: 12, description: "This is the number twelve. It has a one and a two together." },
      { number: 13, description: "This is the number thirteen. It has a one and a three together." },
      { number: 14, description: "This is the number fourteen. It has a one and a four together." },
      { number: 15, description: "This is the number fifteen. It has a one and a five together." },
      { number: 16, description: "This is the number sixteen. It has a one and a six together." },
      { number: 17, description: "This is the number seventeen. It has a one and a seven together." },
      { number: 18, description: "This is the number eighteen. It has a one and an eight together." },
      { number: 19, description: "This is the number nineteen. It has a one and a nine together." },
      { number: 20, description: "This is the number twenty. It has a two and a zero together." },
    ],
  };
  
  // Select the appropriate animation frames based on the topic ID
  const animationFrames = lessonContent[topicId as keyof typeof lessonContent] || lessonContent[1];
  
  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async () => {
      try {
        // Using the mock user ID = 1 since we removed auth dependency
        const mockUserId = 1;
        
        console.log("Updating progress for lesson:", {
          topicId,
          userId: mockUserId,
          watchCompleted: true,
          starsEarned: 1
        });
        
        return apiRequest("POST", `/api/progress/${topicId}`, {
          userId: mockUserId,
          watchCompleted: true,
          starsEarned: 1, // Earn 1 star for completing the lesson
        });
      } catch (error) {
        console.error("Error updating progress:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Progress updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${topicId}`] });
      
      toast({
        title: "Lesson completed!",
        description: "You've earned a star! Moving to the test phase.",
      });
    },
    onError: (error) => {
      console.error("Failed to update progress:", error);
    }
  });
  
  // Auto-play animation frames
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentFrame < animationFrames.length - 1) {
      interval = setInterval(() => {
        setCurrentFrame(prev => {
          const next = prev + 1;
          if (next >= animationFrames.length - 1) {
            setIsPlaying(false);
            setLessonCompleted(true);
          }
          return next;
        });
      }, 3000); // Change frame every 3 seconds
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentFrame, animationFrames.length]);
  
  const handleBackClick = () => {
    setLocation(`/topic/${topicId}`);
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (currentFrame < animationFrames.length - 1) {
      setCurrentFrame(currentFrame + 1);
    } else {
      // Mark lesson as completed and proceed to test
      handleCompleteLesson();
    }
  };
  
  const handlePrevious = () => {
    if (currentFrame > 0) {
      setCurrentFrame(currentFrame - 1);
    }
  };
  
  const handleCompleteLesson = () => {
    // Update progress first
    updateProgressMutation.mutate();
    console.log(`Lesson completed, navigating to test for topic ${topicId}`);
    
    // Add a small delay to ensure the toast notification appears
    setTimeout(() => {
      try {
        // Navigate to test view after completing lesson
        setLocation(`/test/${topicId}`);
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback to topic view if navigation fails
        setLocation(`/topic/${topicId}`);
      }
    }, 300);
  };
  
  const currentAnimation = animationFrames[currentFrame];
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        {...fadeIn}
      >
        {/* Lesson Header */}
        <div className="bg-primary p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="font-heading font-bold">{topic?.name || 'Loading...'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
              <span>Step 1: Watch</span>
            </div>
          </div>
        </div>
        
        {/* Lesson Animation Area */}
        <motion.div 
          className="p-6"
          {...slideUp}
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <motion.div 
                key={currentFrame}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div 
                  className="mb-4"
                  animate={{ 
                    y: [0, -10, 0],
                    transition: { repeat: Infinity, duration: 2 }
                  }}
                >
                  <span className="font-heading font-bold text-[100px] text-primary">
                    {currentAnimation.number}
                  </span>
                </motion.div>
                <p className="text-gray-700">{currentAnimation.description}</p>
              </motion.div>
            </div>
            
            {/* Lesson Progress Bar */}
            <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentFrame + 1) / animationFrames.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Lesson Controls */}
            <div className="flex items-center gap-4">
              <motion.div {...buttonPress}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentFrame === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div {...buttonPress}>
                <Button 
                  size="icon"
                  className="w-12 h-12 rounded-full bg-primary"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </motion.div>
              
              <motion.div {...buttonPress}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Next Section Button */}
          <div className="flex justify-center">
            <motion.div {...buttonPress}>
              <Button 
                className="bg-accent hover:bg-accent/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
                onClick={handleCompleteLesson}
                disabled={!lessonCompleted}
              >
                <ArrowRight className="h-4 w-4" />
                <span>{lessonCompleted ? "Continue to Test" : "Complete the lesson first"}</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
