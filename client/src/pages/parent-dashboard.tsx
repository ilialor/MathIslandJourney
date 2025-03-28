import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Layout, 
  ChevronRight, 
  BarChart3, 
  Clock, 
  Star, 
  Settings,
  Calendar
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { fadeIn, slideUp } from '@/utils/animation-utils';
import { User, Topic, Progress as ProgressType } from '@shared/schema';

export default function ParentDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch mock user data (ID = 1)
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  // Fetch topics for all grades
  const { data: topics = [], isLoading: isLoadingTopics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  // Fetch progress data for the user
  const { data: progressData = [], isLoading: isLoadingProgress } = useQuery<ProgressType[]>({
    queryKey: ['/api/progress/user/1'], // Using mock user ID = 1
  });

  // Calculate summary statistics
  const totalTopics = topics.length;
  const completedTopics = progressData.filter(p => 
    p.watchCompleted && p.testCompleted && p.practiceCompleted && p.teachCompleted
  ).length;
  const totalStars = progressData.reduce((sum, p) => sum + (p.starsEarned ?? 0), 0);
  const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpentMinutes ?? 0), 0);
  const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Group topics by grade
  const topicsByGrade = topics.reduce((acc, topic) => {
    const grade = topic.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(topic);
    return acc;
  }, {} as Record<number, Topic[]>);

  // Get progress for a specific topic
  const getTopicProgress = (topicId: number) => {
    return progressData.find(p => p.topicId === topicId);
  };

  // Calculate completion percentage for a topic
  const calculateCompletionPercentage = (progress: ProgressType | undefined) => {
    if (!progress) return 0;
    
    let steps = 0;
    let completed = 0;
    
    if (progress.watchCompleted) completed++;
    if (progress.testCompleted) completed++;
    if (progress.practiceCompleted) completed++;
    if (progress.teachCompleted) completed++;
    
    steps = 4; // Total steps in the learning cycle
    
    return Math.round((completed / steps) * 100);
  };

  const handleSettingsClick = () => {
    // Navigate to settings page (to be implemented)
    console.log('Navigate to parental settings');
  };

  const handleTopicClick = (topicId: number) => {
    setLocation(`/topic/${topicId}`);
  };

  if (isLoadingUser || isLoadingTopics || isLoadingProgress) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      {...fadeIn}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold text-primary">Parent Dashboard</h1>
        <Button variant="outline" onClick={handleSettingsClick}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Overview Section */}
      <motion.div {...slideUp} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Topics Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{completedTopics}/{totalTopics}</div>
                <Layout className="h-4 w-4 text-muted-foreground" />
              </div>
              <Progress value={completionRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stars Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalStars}</div>
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Time Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalTimeSpent} mins</div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">Today</div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Detailed Progress</TabsTrigger>
          <TabsTrigger value="time">Time Spent</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your child's progress across all grade levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(topicsByGrade).map(([grade, topics]) => (
                <div key={grade} className="mb-8">
                  <h3 className="text-lg font-bold mb-4">Grade {grade}</h3>
                  <div className="space-y-4">
                    {topics.map(topic => {
                      const progress = getTopicProgress(topic.id);
                      const completionPercentage = calculateCompletionPercentage(progress);
                      
                      return (
                        <div 
                          key={topic.id} 
                          className="p-4 bg-accent/10 rounded-lg cursor-pointer hover:bg-accent/20 transition-colors"
                          onClick={() => handleTopicClick(topic.id)}
                        >
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{topic.name}</h4>
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-1">
                                {progress?.starsEarned || 0}
                              </span>
                              <Star className="h-4 w-4 text-yellow-400" />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Progress value={completionPercentage} className="flex-1 h-2 mr-2" />
                            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
                          </div>
                          <div className="flex text-xs text-muted-foreground mt-2">
                            <span className={`mr-3 ${progress?.watchCompleted ? 'text-green-500' : ''}`}>Watch</span>
                            <span className={`mr-3 ${progress?.testCompleted ? 'text-green-500' : ''}`}>Test</span>
                            <span className={`mr-3 ${progress?.practiceCompleted ? 'text-green-500' : ''}`}>Practice</span>
                            <span className={progress?.teachCompleted ? 'text-green-500' : ''}>Teach</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Detailed Progress Tab */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Progress</CardTitle>
              <CardDescription>
                In-depth information about your child's learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressData.map(progress => {
                  const topic = topics.find(t => t.id === progress.topicId);
                  if (!topic) return null;
                  
                  return (
                    <Card key={progress.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                        <CardDescription>Grade {topic.grade} • {topic.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1">Learning Steps</h5>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center">
                                <span className={progress.watchCompleted ? 'text-green-500' : ''}>
                                  Watch
                                </span>
                                {progress.watchCompleted && <span className="text-green-500 ml-1">✓</span>}
                              </li>
                              <li className="flex items-center">
                                <span className={progress.testCompleted ? 'text-green-500' : ''}>
                                  Test
                                </span>
                                {progress.testCompleted && <span className="text-green-500 ml-1">✓</span>}
                              </li>
                              <li className="flex items-center">
                                <span className={progress.practiceCompleted ? 'text-green-500' : ''}>
                                  Practice
                                </span>
                                {progress.practiceCompleted && <span className="text-green-500 ml-1">✓</span>}
                              </li>
                              <li className="flex items-center">
                                <span className={progress.teachCompleted ? 'text-green-500' : ''}>
                                  Teach
                                </span>
                                {progress.teachCompleted && <span className="text-green-500 ml-1">✓</span>}
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Performance</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Stars earned:</span>
                                <span className="font-medium">{progress.starsEarned ?? 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Test score:</span>
                                <span className="font-medium">{progress.testScore ?? 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time spent:</span>
                                <span className="font-medium">{progress.timeSpentMinutes ?? 0} mins</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4"
                          onClick={() => handleTopicClick(topic.id)}
                        >
                          <span>View topic</span>
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Time Spent Tab */}
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time Analysis</CardTitle>
              <CardDescription>
                Track how much time your child spends on each learning activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Time Per Topic</h3>
                <div className="space-y-3">
                  {progressData.map(progress => {
                    const topic = topics.find(t => t.id === progress.topicId);
                    if (!topic) return null;
                    
                    // Calculate the percentage for visual bar width
                    const maxTime = Math.max(...progressData.map(p => p.timeSpentMinutes ?? 0));
                    const percentage = maxTime > 0 ? ((progress.timeSpentMinutes ?? 0) / maxTime) * 100 : 0;
                    
                    return (
                      <div key={progress.id} className="flex items-center">
                        <div className="w-1/3 text-sm truncate pr-4">{topic.name}</div>
                        <div className="w-2/3 flex items-center">
                          <div className="h-4 bg-primary/90 rounded" style={{ width: `${percentage}%` }}></div>
                          <span className="ml-2 text-sm">{progress.timeSpentMinutes ?? 0} mins</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2">Learning Activities Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Average Time Per Learning Step</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Watch Lessons</span>
                          <span>{Math.round(totalTimeSpent * 0.3)} mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tests</span>
                          <span>{Math.round(totalTimeSpent * 0.2)} mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Practice Activities</span>
                          <span>{Math.round(totalTimeSpent * 0.3)} mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Teaching</span>
                          <span>{Math.round(totalTimeSpent * 0.2)} mins</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Weekly Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>This Week</span>
                          <span>{totalTimeSpent} mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Week</span>
                          <span>{Math.round(totalTimeSpent * 0.7)} mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Time Per Session</span>
                          <span>{Math.round(totalTimeSpent / Math.max(1, completedTopics))} mins</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}