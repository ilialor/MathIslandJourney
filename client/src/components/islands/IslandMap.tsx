import React from 'react';
import { motion } from 'framer-motion';
import Island from './Island';
import CharacterGuide from './CharacterGuide';
import { fadeIn } from '@/utils/animation-utils';
import { useQuery } from '@tanstack/react-query';
import { Topic } from "@shared/schema";
import { Link } from 'wouter';

interface IslandMapProps {
  grade: number;
  activeTopic?: number;
}

const IslandMap: React.FC<IslandMapProps> = ({ grade, activeTopic }) => {
  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: [`/api/topics?grade=${grade}`],
  });
  
  // Find active topic and topics by category
  const activeTopicData = topics.find(topic => topic.id === activeTopic);
  const numberTopics = topics.filter(topic => topic.category === 'Numbers');
  const additionTopics = topics.filter(topic => topic.category === 'Addition');
  const shapeTopics = topics.filter(topic => topic.category === 'Shapes');
  const timeTopics = topics.filter(topic => topic.category === 'Time');
  
  const getGuideMessage = () => {
    if (activeTopicData) {
      return `Let's learn about ${activeTopicData.name}!`;
    }
    return "Welcome to Math Island!";
  };
  
  return (
    <motion.div 
      className="relative w-full max-w-5xl mx-auto h-[500px] sm:h-[600px] bg-[#66C3FF] rounded-xl overflow-hidden mb-8"
      {...fadeIn}
    >
      {/* Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#66C3FF] to-primary">
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 50L48 56.7C96 63.3 192 76.7 288 73.3C384 70 480 50 576 40C672 30 768 30 864 36.7C960 43.3 1056 56.7 1152 60C1248 63.3 1344 56.7 1392 53.3L1440 50V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </div>
      
      {/* Numbers Island (Grade 1) */}
      <Link href={numberTopics.length > 0 && !numberTopics[0].isLocked ? `/topic/${numberTopics[0].id}` : '#'}>
        <Island 
          id="numbers"
          name="Numbers"
          position={{ top: "20%", left: "15%" }}
          size={{ width: "44", height: "40" }}
          colors={{ 
            base: "#82D8B9", 
            middle: "#7ED957", 
            top: "#66C3FF" 
          }}
          isLocked={numberTopics.length === 0 || !!numberTopics[0].isLocked}
          isActive={activeTopicData?.category === 'Numbers' || false}
          topic={numberTopics[0]}
        />
      </Link>
      
      {/* Addition Island (Grade 1) */}
      <Link href={additionTopics.length > 0 && !additionTopics[0].isLocked ? `/topic/${additionTopics[0].id}` : '#'}>
        <Island 
          id="addition"
          name="Addition"
          position={{ top: "25%", right: "15%" }}
          size={{ width: "40", height: "32" }}
          colors={{ 
            base: "#FFD166", 
            middle: "#F25C5C", 
            top: "#B088F9" 
          }}
          isLocked={additionTopics.length === 0 || !!additionTopics[0].isLocked}
          isActive={activeTopicData?.category === 'Addition' || false}
          topic={additionTopics[0]}
        />
      </Link>
      
      {/* Shapes Island (Grade 1) */}
      <Link href={shapeTopics.length > 0 && !shapeTopics[0].isLocked ? `/topic/${shapeTopics[0].id}` : '#'}>
        <Island 
          id="shapes"
          name="Shapes"
          position={{ top: "65%", left: "28%" }}
          size={{ width: "36", height: "28" }}
          colors={{ 
            base: "#F25C5C", 
            middle: "#FFD166"
          }}
          isLocked={shapeTopics.length === 0 || !!shapeTopics[0].isLocked}
          isActive={activeTopicData?.category === 'Shapes' || false}
          topic={shapeTopics[0]}
        />
      </Link>
      
      {/* Time Island (Grade 1) */}
      <Link href={timeTopics.length > 0 && !timeTopics[0].isLocked ? `/topic/${timeTopics[0].id}` : '#'}>
        <Island 
          id="time"
          name="Time"
          position={{ top: "65%", right: "28%" }}
          size={{ width: "36", height: "28" }}
          colors={{ 
            base: "#B088F9", 
            middle: "#66C3FF"
          }}
          isLocked={timeTopics.length === 0 || !!timeTopics[0].isLocked}
          isActive={activeTopicData?.category === 'Time' || false}
          topic={timeTopics[0]}
        />
      </Link>
      
      {/* Grade 2 Distant Island - Locked */}
      <Island 
        id="grade2"
        name="Grade 2"
        position={{ top: "60%", right: "5%" }}
        size={{ width: "24", height: "20" }}
        colors={{ base: "#82D8B9" }}
        isLocked={true}
        isActive={false}
      />
      
      {/* Character Guide */}
      <CharacterGuide message={getGuideMessage()} />
    </motion.div>
  );
};

export default IslandMap;
