import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Topic } from '@shared/schema';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VirtualStudent from '@/components/teaching/VirtualStudent';
import TeachingTools from '@/components/teaching/TeachingTools';
import { fadeIn, slideUp } from '@/utils/animation-utils';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { VirtualStudentState } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function TeachView() {
  const { id } = useParams<{ id: string }>();
  const topicId = parseInt(id);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Virtual student state
  const [student, setStudent] = useState<VirtualStudentState>({
    id: 1,
    name: "Timmy",
    imageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Timmy",
    understanding: 10,
    message: "I don't know how to count yet. Can you teach me?"
  });
  
  // Track if teaching is completed (100% understanding)
  const [teachingCompleted, setTeachingCompleted] = useState(false);
  
  // Fetch topic details
  const { 
    data: topic,
    isLoading: isLoadingTopic
  } = useQuery<Topic>({
    queryKey: [`/api/topics/${topicId}`],
  });
  
  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async () => {
      try {
        // Using the mock user ID = 1 since we removed auth dependency
        const mockUserId = 1;
        
        console.log("Updating progress for teaching:", {
          topicId,
          userId: mockUserId,
          teachCompleted: true,
          starsEarned: 2
        });
        
        return apiRequest("POST", `/api/progress/${topicId}`, {
          userId: mockUserId,
          teachCompleted: true,
          starsEarned: 2, // Earn 2 stars for completing teaching
        });
      } catch (error) {
        console.error("Error updating teaching progress:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Teaching progress updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${topicId}`] });
      
      // Also unlock the next topic if this is the first one
      if (topicId === 1) {
        unlockNextTopicMutation.mutate();
      }
    },
    onError: (error) => {
      console.error("Failed to update teaching progress:", error);
    }
  });
  
  // Mutation to unlock the next topic
  const unlockNextTopicMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log("Unlocking next topic (ID: 2)");
        // For this example, we're unlocking topic ID 2 (assuming it exists)
        return apiRequest("POST", "/api/topics/2/unlock", {});
      } catch (error) {
        console.error("Error unlocking next topic:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Next topic unlocked successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      
      toast({
        title: "New Topic Unlocked!",
        description: "You've unlocked the next learning topic. Great job!",
      });
    },
    onError: (error) => {
      console.error("Failed to unlock next topic:", error);
    }
  });
  
  // Check if teaching is completed when understanding reaches 100
  useEffect(() => {
    if (student.understanding >= 100 && !teachingCompleted) {
      setTeachingCompleted(true);
      toast({
        title: "Teaching Completed!",
        description: "Timmy has fully understood counting from 1 to 10. Great job!",
      });
    }
  }, [student.understanding, teachingCompleted]);
  
  const handleBackClick = () => {
    setLocation(`/topic/${topicId}`);
  };
  
  const handleToolUse = (toolId: string, action: string) => {
    // This would have more complex logic in a real app
    console.log(`Tool ${toolId} used with action ${action}`);
  };
  
  const handleUnderstandingIncrease = (amount: number) => {
    setStudent(prev => ({
      ...prev,
      understanding: Math.min(100, prev.understanding + amount)
    }));
  };
  
  const handleMessageUpdate = (message: string) => {
    setStudent(prev => ({
      ...prev,
      message
    }));
  };
  
  const handleCompleteTopic = () => {
    // Update progress first
    updateProgressMutation.mutate();
    console.log(`Teaching completed, navigating back to topic ${topicId}`);
    
    try {
      // Navigate back to the topic view
      setLocation(`/topic/${topicId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to home if navigation fails
      setLocation(`/`);
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        {...fadeIn}
      >
        {/* Teach Header */}
        <div className="bg-accent p-4 text-white flex justify-between items-center">
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
              <span>Step 4: Teach</span>
            </div>
          </div>
        </div>
        
        {/* Virtual Student Teaching Area */}
        <motion.div 
          className="p-6"
          {...slideUp}
        >
          <h4 className="font-heading font-bold text-xl mb-6 text-center">Help Timmy learn to count from 1 to 10!</h4>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Virtual Student Section */}
            <div className="md:w-1/3 flex flex-col items-center">
              <VirtualStudent 
                student={student}
                onUnderstandingUpdate={handleUnderstandingIncrease}
                onMessageUpdate={handleMessageUpdate}
              />
            </div>
            
            {/* Teaching Tools Section */}
            <TeachingTools 
              onToolUse={handleToolUse}
              onUnderstandingIncrease={handleUnderstandingIncrease}
            />
          </div>
          
          {/* Complete Button (shown only when teaching is completed) */}
          {teachingCompleted && (
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                className="bg-accent hover:bg-accent/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
                onClick={handleCompleteTopic}
              >
                <Check className="h-4 w-4" />
                <span>Complete Topic</span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
