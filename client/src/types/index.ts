import { User, Topic, Progress } from "@shared/schema";

export interface LearningStep {
  id: number;
  name: string;
  icon: string;
  isCompleted: boolean;
}

export interface IslandProps {
  id: string;
  name: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
  colors: {
    base: string;
    middle?: string;
    top?: string;
  };
  isLocked: boolean;
  isActive: boolean;
  topic?: Topic;
}

export interface DraggableNumber {
  id: number;
  value: number;
  color: string;
}

export interface DropZone {
  id: number;
  position: number;
  isActive: boolean;
  containsItem: number | null;
}

export interface TeachingTool {
  id: string;
  name: string;
  type: 'numberLine' | 'countingObjects' | 'audio' | 'video';
  isActive: boolean;
}

export interface VirtualStudentState {
  id: number;
  name: string;
  imageUrl: string;
  understanding: number;
  message: string;
}

export type NavItem = {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
};
