import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCampaignSchema, insertCommunicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Leads routes
  app.get("/api/leads", async (req, res) => {
    try {
      const { status, assignedTo, search } = req.query;
      const leads = await storage.getLeads({
        status: status as string,
        assignedTo: assignedTo as string,
        search: search as string,
      });
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.put("/api/leads/:id", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(req.params.id, validatedData);
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const success = await storage.deleteLead(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  app.get("/api/leads-by-status", async (req, res) => {
    try {
      const stats = await storage.getLeadsByStatus();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      res.status(500).json({ error: "Failed to fetch lead statistics" });
    }
  });

  // Campaigns routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const { status, createdBy } = req.query;
      const campaigns = await storage.getCampaigns({
        status: status as string,
        createdBy: createdBy as string,
      });
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid campaign data", details: error.errors });
      }
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.partial().parse(req.body);
      const campaign = await storage.updateCampaign(req.params.id, validatedData);
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid campaign data", details: error.errors });
      }
      console.error("Error updating campaign:", error);
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const success = await storage.deleteCampaign(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  // Communications routes
  app.get("/api/communications", async (req, res) => {
    try {
      const { leadId } = req.query;
      const communications = await storage.getCommunications(leadId as string);
      res.json(communications);
    } catch (error) {
      console.error("Error fetching communications:", error);
      res.status(500).json({ error: "Failed to fetch communications" });
    }
  });

  app.post("/api/communications", async (req, res) => {
    try {
      const validatedData = insertCommunicationSchema.parse(req.body);
      const communication = await storage.createCommunication(validatedData);
      res.status(201).json(communication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid communication data", details: error.errors });
      }
      console.error("Error creating communication:", error);
      res.status(500).json({ error: "Failed to create communication" });
    }
  });

  app.put("/api/communications/:id", async (req, res) => {
    try {
      const validatedData = insertCommunicationSchema.partial().parse(req.body);
      const communication = await storage.updateCommunication(req.params.id, validatedData);
      res.json(communication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid communication data", details: error.errors });
      }
      console.error("Error updating communication:", error);
      res.status(500).json({ error: "Failed to update communication" });
    }
  });

  app.delete("/api/communications/:id", async (req, res) => {
    try {
      const success = await storage.deleteCommunication(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Communication not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting communication:", error);
      res.status(500).json({ error: "Failed to delete communication" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const leadsByStatus = await storage.getLeadsByStatus();
      const allLeads = await storage.getLeads();
      const allCampaigns = await storage.getCampaigns();
      const allCommunications = await storage.getCommunications();

      const totalLeads = allLeads.length;
      const pipelineValue = allLeads.reduce((sum, lead) => {
        return sum + (parseFloat(lead.estimatedValue || '0') * (lead.probability || 0) / 100);
      }, 0);
      
      const closedWonLeads = allLeads.filter(lead => lead.status === 'closed_won').length;
      const conversionRate = totalLeads > 0 ? (closedWonLeads / totalLeads * 100) : 0;

      const stats = {
        totalLeads,
        pipelineValue: `$${(pipelineValue / 1000000).toFixed(1)}M`,
        conversionRate: `${conversionRate.toFixed(1)}%`,
        closedDeals: closedWonLeads,
        leadsByStatus,
        activeCampaigns: allCampaigns.filter(c => c.status === 'active').length,
        totalCommunications: allCommunications.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}