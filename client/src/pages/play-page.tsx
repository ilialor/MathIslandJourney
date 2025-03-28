import React from 'react';
import RootLayout from '@/components/layout/RootLayout';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, fadeInVariants, slideUpVariants } from '@/utils/animation-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Construction } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlayPage() {
  const { toast } = useToast();

  const handlePlayGame = () => {
    toast({
      title: "Coming Soon!",
      description: "Math games will be available in the next update!",
    });
  };

  return (
    <RootLayout>
      <motion.div
        className="container py-8 px-4"
        {...fadeIn}
      >
        <motion.h1 
          className="text-3xl font-heading font-bold text-primary mb-6"
          {...slideUp}
        >
          Math Games
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {[1, 2, 3, 4, 5, 6].map((game) => (
            <motion.div 
              key={game}
              variants={slideUpVariants}
            >
              <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-40 flex items-center justify-center">
                  <Construction className="w-16 h-16 text-primary opacity-50" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>Math Game {game}</CardTitle>
                  <CardDescription>Coming Soon</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button 
                    className="w-full mt-2"
                    onClick={handlePlayGame}
                  >
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </RootLayout>
  );
}