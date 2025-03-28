import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Topic } from '@shared/schema';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import DragDropActivity from '@/components/practice/DragDropActivity';
import { fadeIn, slideUp } from '@/utils/animation-utils';
import { queryClient, apiRequest } from '@/lib/queryClient';

export default function PracticeView() {
  const { id } = useParams<{ id: string }>();
  const topicId = parseInt(id);
  const [location, setLocation] = useLocation();
  
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
      return apiRequest("POST", `/api/progress/${topicId}`, {
        practiceCompleted: true,
        starsEarned: 1, // Earn 1 star for completing practice
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${topicId}`] });
    }
  });
  
  const handleBackClick = () => {
    setLocation(`/topic/${topicId}`);
  };
  
  const handleActivityComplete = () => {
    updateProgressMutation.mutate();
    // Navigate to teach view after completing practice
    setLocation(`/teach/${topicId}`);
  };
  
  const handleActivityReset = () => {
    // Logic to reset activity state if needed
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        {...fadeIn}
      >
        {/* Practice Header */}
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
              <span>Step 3: Practice</span>
            </div>
          </div>
        </div>
        
        {/* Practice Activity Area */}
        <motion.div 
          className="p-6"
          {...slideUp}
        >
          <DragDropActivity 
            onComplete={handleActivityComplete}
            onReset={handleActivityReset}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
