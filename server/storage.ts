import { users, topics, progress, type User, type InsertUser, type Topic, type InsertTopic, type Progress, type InsertProgress } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStars(userId: number, stars: number): Promise<User | undefined>;
  
  // Topic methods
  getTopic(id: number): Promise<Topic | undefined>;
  getTopics(grade?: number, category?: string): Promise<Topic[]>;
  unlockTopic(id: number): Promise<Topic | undefined>;
  
  // Progress methods
  getProgressByUserAndTopic(userId: number, topicId: number): Promise<Progress | undefined>;
  updateProgress(userId: number, topicId: number, update: Partial<Omit<InsertProgress, 'userId' | 'topicId'>>): Promise<Progress | undefined>;
  getAllUserProgress(userId: number): Promise<Progress[]>;
  
  // Session store
  sessionStore: any; // Using any for session store to avoid type errors
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private progressData: Map<string, Progress>;
  sessionStore: any; // Using any for session store to avoid type errors
  currentUserId: number;
  currentTopicId: number;
  currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.progressData = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentUserId = 1;
    this.currentTopicId = 1;
    this.currentProgressId = 1;
    
    // Initialize with default topics for grade 1
    this.initializeDefaultTopics();
    
    // Create a test user (sammy/password123)
    this.createUser({
      username: "sammy",
      password: "47e08e336559243f6d4c77f7c88a42887acdb53a6654e80f0e4fc50cc937e6d28f9121abb60540cc861bb3e711c0e3a3502e19ffb69266c9d13a73ebd41564b0.36e16e0bac780eefa985c82cd67176e2",
      displayName: "Sammy Student",
      grade: 1
    }).then(user => {
      console.log("Created test user:", user.username);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // The role and stars fields have defaults in the schema
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName ?? null,
      grade: insertUser.grade ?? null,
      role: "student",
      stars: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStars(userId: number, stars: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, stars: stars };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Topic methods
  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopics(grade?: number, category?: string): Promise<Topic[]> {
    let filteredTopics = Array.from(this.topics.values());
    
    if (grade !== undefined) {
      filteredTopics = filteredTopics.filter(topic => topic.grade === grade);
    }
    
    if (category !== undefined) {
      filteredTopics = filteredTopics.filter(topic => topic.category === category);
    }
    
    return filteredTopics.sort((a, b) => a.order - b.order);
  }

  async unlockTopic(id: number): Promise<Topic | undefined> {
    const topic = await this.getTopic(id);
    if (!topic) return undefined;
    
    const updatedTopic = { ...topic, isLocked: false };
    this.topics.set(id, updatedTopic);
    return updatedTopic;
  }

  // Progress methods
  async getProgressByUserAndTopic(userId: number, topicId: number): Promise<Progress | undefined> {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!topicId) throw new Error("Topic ID is required");
      
      const key = `${userId}-${topicId}`;
      return this.progressData.get(key);
    } catch (error) {
      console.error(`Error getting progress for user ${userId}, topic ${topicId}:`, error);
      return undefined;
    }
  }

  async updateProgress(userId: number, topicId: number, update: Partial<Omit<InsertProgress, 'userId' | 'topicId'>>): Promise<Progress | undefined> {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!topicId) throw new Error("Topic ID is required");
      
      const key = `${userId}-${topicId}`;
      let progress = this.progressData.get(key);
      
      if (!progress) {
        console.log(`Creating new progress record for user ${userId}, topic ${topicId}`);
        progress = {
          id: this.currentProgressId++,
          userId,
          topicId,
          watchCompleted: false,
          testCompleted: false,
          practiceCompleted: false,
          teachCompleted: false,
          starsEarned: 0,
          timeSpentMinutes: 0,
          testScore: null,
          updatedAt: new Date(),
        };
      }
      
      const updatedProgress = { 
        ...progress, 
        ...update,
        updatedAt: new Date()
      };
      
      this.progressData.set(key, updatedProgress);
      console.log(`Progress updated for user ${userId}, topic ${topicId}:`, update);
      return updatedProgress;
    } catch (error) {
      console.error(`Error updating progress for user ${userId}, topic ${topicId}:`, error);
      return undefined;
    }
  }

  async getAllUserProgress(userId: number): Promise<Progress[]> {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const userProgress = Array.from(this.progressData.values()).filter(
        (progress) => progress.userId === userId,
      );
      
      console.log(`Retrieved ${userProgress.length} progress records for user ${userId}`);
      return userProgress;
    } catch (error) {
      console.error(`Error retrieving all progress for user ${userId}:`, error);
      return [];
    }
  }

  // Helper methods to initialize default data
  private initializeDefaultTopics() {
    // Grade 1 - Numbers topics
    this.addTopic({
      name: "Counting Numbers 1-10",
      description: "Learn to count from 1 to 10 with fun animations and activities!",
      grade: 1,
      category: "Numbers",
      order: 1,
      island: "Numbers",
      isLocked: false, // First topic is unlocked by default
    });
    
    this.addTopic({
      name: "Numbers 11-20",
      description: "Discover numbers from 11 to 20 and how to count them.",
      grade: 1,
      category: "Numbers",
      order: 2,
      island: "Numbers",
      isLocked: true,
    });
    
    // Grade 1 - Addition topics
    this.addTopic({
      name: "Addition Within 10",
      description: "Learn how to add numbers together up to a sum of 10.",
      grade: 1,
      category: "Addition",
      order: 1,
      island: "Addition",
      isLocked: true,
    });
    
    // Grade 1 - Shapes topics
    this.addTopic({
      name: "Basic 2D Shapes",
      description: "Explore circles, triangles, squares, and rectangles.",
      grade: 1,
      category: "Shapes",
      order: 1,
      island: "Shapes",
      isLocked: true,
    });
    
    // Grade 1 - Time topics
    this.addTopic({
      name: "Reading Clock Hours",
      description: "Learn to tell time to the hour on an analog clock.",
      grade: 1,
      category: "Time",
      order: 1,
      island: "Time",
      isLocked: true,
    });
  }

  private addTopic(topic: InsertTopic): number {
    const id = this.currentTopicId++;
    const newTopic: Topic = { 
      ...topic, 
      id,
      isLocked: topic.isLocked ?? false
    };
    this.topics.set(id, newTopic);
    return id;
  }
}

export const storage = new MemStorage();
