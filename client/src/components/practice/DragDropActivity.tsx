import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DraggableNumber, DropZone } from '@/types';
import { Volume2, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { buttonPress, dragItem } from '@/utils/animation-utils';
import { useToast } from '@/hooks/use-toast';

interface DragDropActivityProps {
  onComplete: () => void;
  onReset: () => void;
}

const DragDropActivity: React.FC<DragDropActivityProps> = ({ onComplete, onReset }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [currentDragItem, setCurrentDragItem] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Initial numbers in shuffled order
  const [numbers, setNumbers] = useState<DraggableNumber[]>([
    { id: 1, value: 7, color: 'bg-[#82D8B9]' },
    { id: 2, value: 2, color: 'bg-[#FFD166]' },
    { id: 3, value: 9, color: 'bg-[#F25C5C]' },
    { id: 4, value: 4, color: 'bg-primary' },
    { id: 5, value: 10, color: 'bg-[#B088F9]' },
    { id: 6, value: 5, color: 'bg-[#66C3FF]' },
    { id: 7, value: 1, color: 'bg-accent' },
    { id: 8, value: 8, color: 'bg-secondary' },
    { id: 9, value: 3, color: 'bg-[#82D8B9]' },
    { id: 10, value: 6, color: 'bg-primary' },
  ]);
  
  // Drop zones
  const [dropZones, setDropZones] = useState<DropZone[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      position: i + 1,
      isActive: false,
      containsItem: null,
    }))
  );
  
  const handleDragStart = (numberId: number) => {
    setIsDragging(true);
    setCurrentDragItem(numberId);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrentDragItem(null);
  };
  
  const handleDragOver = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    // Update drop zone active state
    setDropZones(zones => 
      zones.map(zone => 
        zone.id === zoneId 
          ? { ...zone, isActive: true } 
          : { ...zone, isActive: false }
      )
    );
  };
  
  const handleDragLeave = (zoneId: number) => {
    // Remove active state
    setDropZones(zones => 
      zones.map(zone => 
        zone.id === zoneId 
          ? { ...zone, isActive: false } 
          : zone
      )
    );
  };
  
  const handleDrop = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    
    if (currentDragItem === null) return;
    
    // Find the number that was dragged
    const draggedNumber = numbers.find(num => num.id === currentDragItem);
    if (!draggedNumber) return;
    
    // Check if this zone already has an item
    const targetZone = dropZones.find(zone => zone.id === zoneId);
    
    // If zone has an item, and it's not the same one we're dropping, swap it back to available
    if (targetZone?.containsItem && targetZone.containsItem !== currentDragItem) {
      // This spot is already filled
      toast({
        title: "Spot already filled",
        description: "This spot already has a number. Try another spot or reset.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the drop zones
    setDropZones(zones => 
      zones.map(zone => 
        zone.id === zoneId 
          ? { ...zone, containsItem: currentDragItem, isActive: false } 
          : zone
      )
    );
    
    // Check if all zones are filled
    setTimeout(() => {
      const allFilled = dropZones.every(zone => zone.containsItem !== null);
      if (allFilled) {
        checkAnswer();
      }
    }, 500);
  };
  
  const checkAnswer = () => {
    let isCorrect = true;
    
    // Check if each number is in the correct position
    dropZones.forEach(zone => {
      if (zone.containsItem) {
        const item = numbers.find(num => num.id === zone.containsItem);
        if (item && item.value !== zone.position) {
          isCorrect = false;
        }
      } else {
        isCorrect = false;
      }
    });
    
    if (isCorrect) {
      setIsCompleted(true);
      toast({
        title: "Great job!",
        description: "You put the numbers in the correct order!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Some numbers are not in the right place. Try again!",
        variant: "destructive",
      });
    }
  };
  
  const resetActivity = () => {
    setDropZones(zones => 
      zones.map(zone => ({
        ...zone,
        containsItem: null,
        isActive: false,
      }))
    );
    setIsCompleted(false);
    onReset();
  };
  
  const playAudio = () => {
    toast({
      title: "Instructions",
      description: "Drag each number from below and drop it into the correct spot to create the sequence from 1 to 10.",
    });
  };
  
  // Filter out numbers that have been dropped
  const availableNumbers = numbers.filter(num => 
    !dropZones.some(zone => zone.containsItem === num.id)
  );
  
  return (
    <div>
      <h4 className="font-heading font-bold text-xl mb-6 text-center">Drag the numbers to put them in the correct order!</h4>
      
      {/* Instructions Area */}
      <div className="flex items-center justify-center mb-8 gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={playAudio}
          className="cursor-pointer"
        >
          <Volume2 className="text-2xl text-primary" />
        </motion.div>
        <div className="bg-background rounded-lg px-4 py-2 max-w-md">
          <p className="text-gray-700">Drag each number from below and drop it into the correct spot to create the sequence from 1 to 10.</p>
        </div>
      </div>
      
      {/* Drag and Drop Area */}
      <div className="mb-8">
        {/* Target Drop Zones */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {dropZones.map((zone) => {
            const droppedItem = zone.containsItem 
              ? numbers.find(num => num.id === zone.containsItem) 
              : null;
              
            return (
              <motion.div
                key={zone.id}
                className={`drop-zone w-16 h-16 border-2 border-dashed ${
                  zone.isActive 
                    ? 'border-accent bg-accent/10' 
                    : 'border-gray-300 bg-gray-50'
                } rounded-lg flex items-center justify-center`}
                data-position={zone.position}
                onDragOver={(e) => handleDragOver(e, zone.id)}
                onDragLeave={() => handleDragLeave(zone.id)}
                onDrop={(e) => handleDrop(e, zone.id)}
              >
                {droppedItem ? (
                  <motion.div 
                    className={`drag-item w-full h-full ${droppedItem.color} rounded-lg flex items-center justify-center shadow-md cursor-grab`}
                    data-value={droppedItem.value}
                    {...dragItem}
                    draggable
                    onDragStart={() => handleDragStart(droppedItem.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="font-heading font-bold text-2xl text-white">{droppedItem.value}</span>
                  </motion.div>
                ) : (
                  <span className="text-gray-400 text-xs">Drop here</span>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Draggable Number Items */}
        <div className="flex flex-wrap justify-center gap-4" id="draggable-items">
          {availableNumbers.map((number) => (
            <motion.div
              key={number.id}
              className={`drag-item w-16 h-16 ${number.color} rounded-lg flex items-center justify-center shadow-md cursor-grab`}
              data-value={number.value}
              {...dragItem}
              draggable
              onDragStart={() => handleDragStart(number.id)}
              onDragEnd={handleDragEnd}
            >
              <span className="font-heading font-bold text-2xl text-white">{number.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <motion.div {...buttonPress}>
          <Button 
            variant="secondary"
            className="learn-button bg-gray-200 hover:bg-gray-300 text-gray-700 font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2"
            onClick={resetActivity}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </motion.div>
        
        <motion.div {...buttonPress}>
          <Button 
            className="learn-button bg-primary hover:bg-primary/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
            onClick={checkAnswer}
            disabled={dropZones.some(zone => zone.containsItem === null)}
          >
            <Check className="h-4 w-4" />
            <span>Check Answer</span>
          </Button>
        </motion.div>
        
        <motion.div {...buttonPress}>
          <Button 
            className="learn-button bg-accent hover:bg-accent/90 text-white font-heading font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md"
            onClick={onComplete}
            disabled={!isCompleted}
          >
            <ArrowRight className="h-4 w-4" />
            <span>Next</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DragDropActivity;
