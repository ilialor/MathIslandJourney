import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get topics route
  app.get("/api/topics", async (req, res) => {
    try {
      const grade = req.query.grade ? parseInt(req.query.grade as string) : undefined;
      const category = req.query.category as string | undefined;
      
      const topics = await storage.getTopics(grade, category);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Get topic by ID
  app.get("/api/topics/:id", async (req, res) => {
    try {
      const topicId = parseInt(req.params.id);
      const topic = await storage.getTopic(topicId);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  // Unlock a topic
  app.post("/api/topics/:id/unlock", async (req, res) => {
    // Removed authentication check for our mock approach
    try {
      console.log(`Unlocking topic ID: ${req.params.id}`);
      const topicId = parseInt(req.params.id);
      const updatedTopic = await storage.unlockTopic(topicId);
      
      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      console.log("Topic unlocked successfully:", updatedTopic);
      res.json(updatedTopic);
    } catch (error) {
      console.error("Error unlocking topic:", error);
      res.status(500).json({ message: "Failed to unlock topic", error: String(error) });
    }
  });

  // Get all user progress (for current user)
  app.get("/api/progress", async (req, res) => {
    try {
      let userId: number;
      
      if (req.isAuthenticated()) {
        // If authenticated, use the logged-in user's ID
        userId = req.user.id;
      } else {
        // For mock approach, use user ID 1
        userId = 1;
        console.log("Using mock user ID 1 for all progress fetch");
      }
      
      console.log(`Fetching all progress for userId: ${userId}`);
      const progress = await storage.getAllUserProgress(userId);
      console.log(`Found ${progress.length} progress records`);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching all progress:", error);
      res.status(500).json({ message: "Failed to fetch progress", error: String(error) });
    }
  });
  
  // Get progress for a specific user (for parent dashboard)
  app.get("/api/progress/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // In a real app, we would check if the current user has permission to view this user's progress
      // For now, we'll just allow it for our mock implementation
      
      console.log(`Fetching all progress for specific userId: ${userId}`);
      const progress = await storage.getAllUserProgress(userId);
      console.log(`Found ${progress.length} progress records for user ${userId}`);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress", error: String(error) });
    }
  });

  // Get progress for a specific topic
  app.get("/api/progress/:topicId", async (req, res) => {
    try {
      let userId: number;
      
      if (req.isAuthenticated()) {
        // If authenticated, use the logged-in user's ID
        userId = req.user.id;
      } else {
        // For mock approach, use user ID 1
        userId = 1;
        console.log("Using mock user ID 1 for progress fetch");
      }
      
      const topicId = parseInt(req.params.topicId);
      console.log(`Fetching progress for userId: ${userId}, topicId: ${topicId}`);
      
      const progress = await storage.getProgressByUserAndTopic(userId, topicId);
      
      if (!progress) {
        // Return an empty progress object if none exists
        console.log(`No progress found, returning default progress for userId: ${userId}, topicId: ${topicId}`);
        return res.json({
          userId,
          topicId,
          watchCompleted: false,
          testCompleted: false,
          practiceCompleted: false,
          teachCompleted: false,
          starsEarned: 0
        });
      }
      
      console.log("Progress fetched:", progress);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress", error: String(error) });
    }
  });

  // Update progress for a topic
  app.post("/api/progress/:topicId", async (req, res) => {
    try {
      // Modified to accept userId directly from the request body for our mock approach
      let userId: number;
      
      if (req.isAuthenticated()) {
        // If authenticated, use the logged-in user's ID
        userId = req.user.id;
      } else if (req.body.userId) {
        // Otherwise, use the ID from the request body (for our mock user approach)
        userId = parseInt(req.body.userId);
        console.log(`Using userId from request body: ${userId}`);
      } else {
        return res.status(401).json({ message: "Unauthorized - no user ID provided" });
      }
      
      const topicId = parseInt(req.params.topicId);
      console.log(`Updating progress for userId: ${userId}, topicId: ${topicId}`);
      
      // Validate request body
      const updateSchema = z.object({
        userId: z.number().optional(),
        watchCompleted: z.boolean().optional(),
        testCompleted: z.boolean().optional(),
        practiceCompleted: z.boolean().optional(),
        teachCompleted: z.boolean().optional(),
        starsEarned: z.number().optional(),
      });
      
      // Remove userId from the data before passing to updateProgress
      const validatedData = updateSchema.parse(req.body);
      const { userId: _, ...updateData } = validatedData;
      
      const updatedProgress = await storage.updateProgress(userId, topicId, updateData);
      console.log("Progress updated:", updatedProgress);
      
      // If stars were earned, update the user's total stars
      if (updateData.starsEarned !== undefined) {
        const user = await storage.getUser(userId);
        if (user) {
          // Use 0 if user.stars is null
          const updatedUser = await storage.updateUserStars(userId, (user.stars ?? 0) + updateData.starsEarned);
          console.log(`Updated user stars: ${updatedUser?.stars}`);
        }
      }
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
