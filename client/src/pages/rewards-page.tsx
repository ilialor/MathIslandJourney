import React from 'react';
import RootLayout from '@/components/layout/RootLayout';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, fadeInVariants, slideUpVariants } from '@/utils/animation-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Award, Lock, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function RewardsPage() {
  const { user } = useAuth();
  
  const achievements = [
    {
      id: 1,
      name: "Math Explorer",
      description: "Complete 3 topics in Grade 1",
      progress: 66,
      icon: <Trophy className="h-5 w-5" />,
      isComplete: false
    },
    {
      id: 2,
      name: "Star Collector",
      description: "Earn 10 stars",
      progress: 100,
      icon: <Star className="h-5 w-5" />,
      isComplete: true
    },
    {
      id: 3,
      name: "Math Teacher",
      description: "Complete 5 teach activities",
      progress: 40,
      icon: <Award className="h-5 w-5" />,
      isComplete: false
    },
    {
      id: 4,
      name: "Speed Master",
      description: "Complete a test with perfect score in under 1 minute",
      progress: 0,
      icon: <Trophy className="h-5 w-5" />,
      isComplete: false,
      locked: true
    }
  ];
  
  const rewards = [
    {
      id: 1,
      name: "Profile Character",
      description: "Unlock the dinosaur character",
      cost: 20,
      icon: <Gift className="h-6 w-6" />,
      isLocked: true
    },
    {
      id: 2,
      name: "Special Island",
      description: "Access to the bonus games island",
      cost: 50,
      icon: <Gift className="h-6 w-6" />,
      isLocked: true
    },
    {
      id: 3,
      name: "Custom Background",
      description: "Personalize your learning space",
      cost: 15,
      icon: <Gift className="h-6 w-6" />,
      isLocked: false
    }
  ];

  return (
    <RootLayout>
      <motion.div
        className="container py-8 px-4"
        {...fadeIn}
      >
        <motion.div 
          className="flex items-center mb-8"
          {...slideUp}
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Rewards & Achievements</h1>
            <p className="text-muted-foreground">
              Complete activities and collect stars to unlock rewards
            </p>
          </div>
          <div className="ml-auto flex items-center bg-yellow-100 px-3 py-1 rounded-full">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-bold">{user?.stars || 0}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Achievements Section */}
          <motion.div 
            className="space-y-6"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-heading font-semibold flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Achievements
            </h2>
            
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <motion.div 
                  key={achievement.id}
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  <Card className={`border-l-4 ${achievement.isComplete ? 'border-l-green-500' : 'border-l-primary'}`}>
                    {achievement.locked && (
                      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center rounded-md">
                        <div className="bg-white/90 p-2 rounded-full">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          <span className="bg-primary/10 p-1 rounded-full mr-2">
                            {achievement.icon}
                          </span>
                          {achievement.name}
                        </CardTitle>
                        {achievement.isComplete && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Complete
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Rewards Section */}
          <motion.div 
            className="space-y-6"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-heading font-semibold flex items-center">
              <Gift className="mr-2 h-5 w-5 text-primary" />
              Rewards Shop
            </h2>
            
            <div className="space-y-3">
              {rewards.map((reward) => (
                <motion.div 
                  key={reward.id}
                  whileHover={{ y: -2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          <span className="bg-primary/10 p-1 rounded-full mr-2">
                            {reward.icon}
                          </span>
                          {reward.name}
                        </CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{reward.cost}</span>
                        </div>
                      </div>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                          reward.isLocked 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                        disabled={reward.isLocked}
                      >
                        {reward.isLocked 
                          ? (user?.stars || 0) >= reward.cost 
                            ? 'Unlock Reward' 
                            : `Need ${reward.cost - (user?.stars || 0)} more stars`
                          : 'Claim Reward'
                        }
                      </motion.button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </RootLayout>
  );
}