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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const topicId = parseInt(req.params.id);
      const updatedTopic = await storage.unlockTopic(topicId);
      
      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      res.json(updatedTopic);
    } catch (error) {
      res.status(500).json({ message: "Failed to unlock topic" });
    }
  });

  // Get user progress
  app.get("/api/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const progress = await storage.getAllUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Get progress for a specific topic
  app.get("/api/progress/:topicId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const topicId = parseInt(req.params.topicId);
      const progress = await storage.getProgressByUserAndTopic(userId, topicId);
      
      if (!progress) {
        // Return an empty progress object if none exists
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
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update progress for a topic
  app.post("/api/progress/:topicId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const topicId = parseInt(req.params.topicId);
      
      // Validate request body
      const updateSchema = z.object({
        watchCompleted: z.boolean().optional(),
        testCompleted: z.boolean().optional(),
        practiceCompleted: z.boolean().optional(),
        teachCompleted: z.boolean().optional(),
        starsEarned: z.number().optional(),
      });
      
      const validatedData = updateSchema.parse(req.body);
      
      const updatedProgress = await storage.updateProgress(userId, topicId, validatedData);
      
      // If stars were earned, update the user's total stars
      if (validatedData.starsEarned !== undefined) {
        const user = await storage.getUser(userId);
        if (user) {
          // Use 0 if user.stars is null
          await storage.updateUserStars(userId, (user.stars ?? 0) + validatedData.starsEarned);
        }
      }
      
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
