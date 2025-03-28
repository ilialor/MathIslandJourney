import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Topic, Progress } from '@shared/schema';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import IslandMap from '@/components/islands/IslandMap';
import TopicCard from '@/components/learning/TopicCard';
import { fadeIn, slideUp } from '@/utils/animation-utils';
import { queryClient, apiRequest } from '@/lib/queryClient';

export default function NavigationView() {
  const { id } = useParams<{ id?: string }>();
  const topicId = id ? parseInt(id) : undefined;
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<number>(user?.grade || 1);
  
  // Fetch topics for the selected grade
  const { 
    data: topics = [], 
    isLoading: isLoadingTopics 
  } = useQuery<Topic[]>({
    queryKey: [`/api/topics?grade=${selectedGrade}`],
  });
  
  // Fetch selected topic
  const { 
    data: selectedTopic,
    isLoading: isLoadingTopic
  } = useQuery<Topic>({
    queryKey: [`/api/topics/${topicId}`],
    enabled: !!topicId,
  });
  
  // Fetch progress for the selected topic
  const {
    data: topicProgress,
    isLoading: isLoadingProgress
  } = useQuery<Progress>({
    queryKey: [`/api/progress/${topicId}`],
    enabled: !!topicId && !!user,
  });
  
  // Mutation to restart topic progress
  const restartProgressMutation = useMutation({
    mutationFn: async () => {
      if (!topicId || !user) return;
      
      return apiRequest("POST", `/api/progress/${topicId}`, {
        watchCompleted: false,
        testCompleted: false,
        practiceCompleted: false,
        teachCompleted: false,
        starsEarned: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${topicId}`] });
    }
  });
  
  const handleContinueLearning = () => {
    if (!selectedTopic) return;
    
    if (!topicProgress?.watchCompleted) {
      setLocation(`/learn/${selectedTopic.id}`);
    } else if (!topicProgress?.testCompleted) {
      // Test view would go here - for now we'll skip to practice
      setLocation(`/practice/${selectedTopic.id}`);
    } else if (!topicProgress?.practiceCompleted) {
      setLocation(`/practice/${selectedTopic.id}`);
    } else if (!topicProgress?.teachCompleted) {
      setLocation(`/teach/${selectedTopic.id}`);
    }
  };
  
  const handleRestartTopic = () => {
    restartProgressMutation.mutate();
  };
  
  const isLoading = isLoadingTopics || (topicId && isLoadingTopic) || (topicId && isLoadingProgress);
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <motion.h2 
          className="font-heading font-bold text-2xl sm:text-3xl text-text-dark mb-2"
          {...fadeIn}
        >
          Math Adventure Islands
        </motion.h2>
        <motion.p 
          className="font-body text-gray-600 max-w-xl mx-auto"
          {...slideUp}
        >
          Explore exciting math concepts across different islands! Complete challenges to unlock new areas.
        </motion.p>
      </div>
      
      {/* Grade Selector */}
      <motion.div 
        className="flex justify-center mb-6"
        {...fadeIn}
      >
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {[1, 2, 3, 4].map((grade) => (
            <button
              key={grade}
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                selectedGrade === grade
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${grade === 1 ? 'rounded-l-lg' : ''} ${
                grade === 4 ? 'rounded-r-lg' : ''
              } border border-gray-200`}
              onClick={() => setSelectedGrade(grade)}
              disabled={grade !== 1} // Only Grade 1 is implemented for now
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Island Map */}
      <IslandMap grade={selectedGrade} activeTopic={topicId} />
      
      {/* Current Topic Information */}
      {selectedTopic && (
        <motion.div {...slideUp}>
          <TopicCard 
            topic={selectedTopic}
            progress={topicProgress}
            onContinue={handleContinueLearning}
            onRestart={handleRestartTopic}
          />
        </motion.div>
      )}
    </div>
  );
}
