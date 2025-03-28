import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Topic } from '@shared/schema';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeIn, slideUp, buttonPress } from '@/utils/animation-utils';
import { queryClient, apiRequest } from '@/lib/queryClient';

export default function TestView() {
  const { id } = useParams<{ id: string }>();
  const topicId = parseInt(id);
  const [location, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // Fetch topic details
  const { 
    data: topic,
    isLoading: isLoadingTopic
  } = useQuery<Topic>({
    queryKey: [`/api/topics/${topicId}`],
  });
  
  // Sample quiz questions for numbers 1-10
  const questions = [
    {
      question: "Which number comes after 3?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2 // Index of "4"
    },
    {
      question: "Which number is bigger?",
      options: ["7", "2", "5", "1"],
      correctAnswer: 0 // Index of "7"
    },
    {
      question: "How many fingers are on one hand?",
      options: ["3", "5", "6", "10"],
      correctAnswer: 1 // Index of "5"
    },
    {
      question: "What number is this: 🔟?",
      options: ["8", "9", "10", "11"],
      correctAnswer: 2 // Index of "10"
    },
    {
      question: "Count these dots: •••. How many dots are there?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2 // Index of "3"
    }
  ];
  
  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async () => {
      try {
        // Using the mock user ID = 1 since we removed auth dependency
        const mockUserId = 1;
        
        console.log("Updating progress for test:", {
          topicId,
          userId: mockUserId,
          testCompleted: true,
          starsEarned: (score >= questions.length * 0.7) ? 1 : 0 // Need 70% to earn a star
        });
        
        return apiRequest("POST", `/api/progress/${topicId}`, {
          userId: mockUserId,
          testCompleted: true,
          starsEarned: (score >= questions.length * 0.7) ? 1 : 0,
        });
      } catch (error) {
        console.error("Error updating progress:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Test progress updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${topicId}`] });
    },
    onError: (error) => {
      console.error("Failed to update test progress:", error);
    }
  });
  
  const handleBackClick = () => {
    setLocation(`/topic/${topicId}`);
  };
  
  const handleAnswerSelect = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index);
    }
  };
  
  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    
    // Check if answer is correct
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTestCompleted(true);
    }
  };
  
  const handleCompleteTest = () => {
    // Update progress first
    updateProgressMutation.mutate();
    console.log(`Test completed, navigating to practice for topic ${topicId}`);
    
    try {
      // Navigate to practice view after completing test
      setLocation(`/practice/${topicId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to topic view if navigation fails
      setLocation(`/topic/${topicId}`);
    }
  };
  
  // Current question
  const currentQuizQuestion = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQuizQuestion.correctAnswer;
  const passingScore = Math.ceil(questions.length * 0.7);
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        {...fadeIn}
      >
        {/* Test Header */}
        <div className="bg-secondary p-4 text-white flex justify-between items-center">
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
              <span>Step 2: Test</span>
            </div>
          </div>
        </div>
        
        {/* Test Content Area */}
        <motion.div 
          className="p-6"
          {...slideUp}
        >
          {!testCompleted ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-secondary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Question */}
              <div className="text-center">
                <h4 className="font-heading font-bold text-xl mb-2">Question {currentQuestion + 1}</h4>
                <p className="text-lg mb-6">{currentQuizQuestion.question}</p>
              </div>
              
              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQuizQuestion.options.map((option, index) => (
                  <motion.div 
                    key={index}
                    {...buttonPress}
                  >
                    <button
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedAnswer === index 
                          ? 'bg-primary-foreground border-2 border-primary' 
                          : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                      } ${
                        showFeedback && index === currentQuizQuestion.correctAnswer
                          ? 'bg-green-100 border-2 border-green-500'
                          : ''
                      } ${
                        showFeedback && selectedAnswer === index && !isCorrect
                          ? 'bg-red-100 border-2 border-red-500'
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{option}</span>
                        {showFeedback && index === currentQuizQuestion.correctAnswer && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        {showFeedback && selectedAnswer === index && !isCorrect && (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center mt-8">
                {!showFeedback ? (
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white font-heading font-bold py-3 px-6 rounded-full shadow-md"
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-white font-heading font-bold py-3 px-6 rounded-full shadow-md"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Test Results
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-heading font-bold text-2xl mb-2">Test Complete!</h3>
              
              <div className="bg-gray-100 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-lg mb-2">Your Score:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-heading font-bold text-4xl text-secondary">
                    {score}
                  </span>
                  <span className="text-lg text-gray-500">/ {questions.length}</span>
                </div>
                
                <div className="mt-4">
                  {score >= passingScore ? (
                    <div className="text-green-600 flex items-center justify-center gap-2">
                      <Check className="h-5 w-5" />
                      <span>Congratulations! You passed the test.</span>
                    </div>
                  ) : (
                    <div className="text-amber-600">
                      <span>You need {passingScore} correct answers to pass.</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                className="bg-accent hover:bg-accent/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
                onClick={handleCompleteTest}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue to Practice</span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}