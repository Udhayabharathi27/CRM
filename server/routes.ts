import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCampaignSchema, insertCommunicationSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";

const sampleUsers = [
  {
    id: '57aec392-41bc-44a8-ad61-8a7ed6afdf62',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    id: '6d3e500b-0ec1-405e-9bc6-aec4aca51822',
    username: 'john',
    email: 'john@example.com',
    password: 'john123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'sales',
  },
  {
    id: '1d3e06fb-b1fe-40c1-b67d-a38f1becf695',
    username: 'jane',
    email: 'jane@example.com',
    password: 'jane123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'sales',
  },
  {
    id: 'c177576b-322e-4610-83b0-95d34247c436',
    username: 'mike',
    email: 'mike@example.com',
    password: 'mike123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'marketing',
  },
];

async function seedUsers() {
  for (const user of sampleUsers) {
    const existing = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(users).values(user);
      console.log(`Inserted user: ${user.username}`);
    } else {
      console.log(`User ${user.username} already exists`);
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  if (process.env.NODE_ENV === 'development') {
    await seedUsers();
  }

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
  // Debug endpoint to check users
app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await db.select().from(users);
    console.log('📋 Available users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
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
    console.log('POST /api/leads - Request body:', req.body);
    const validatedData = insertLeadSchema.parse(req.body);
    console.log('Validated data:', validatedData);
    const lead = await storage.createLead(validatedData);
    console.log('Lead created successfully:', lead);
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid lead data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create lead", details: error.message });
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
    console.log('🔵 POST /api/communications - Raw request body:', JSON.stringify(req.body, null, 2));
    
    const validatedData = insertCommunicationSchema.parse(req.body);
    console.log('✅ Validated communication data:', validatedData);
    
    const communication = await storage.createCommunication(validatedData);
    console.log('✅ Communication created successfully:', communication);
    
    res.status(201).json(communication);
  } catch (error) {
    console.error('❌ Error creating communication:', error);
    
    if (error instanceof z.ZodError) {
      console.error('📋 Communication validation errors:');
      error.errors.forEach(e => {
        console.error(`   Field: ${e.path.join('.')}, Error: ${e.message}, Received:`, e.received);
      });
      
      return res.status(400).json({ 
        error: "Invalid communication data", 
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          received: e.received
        }))
      });
    }
    
    res.status(500).json({ error: "Failed to create communication", details: error.message });
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

    // DEBUG: Log lead data
    console.log('🔍 Leads data for pipeline calculation:');
    allLeads.forEach(lead => {
      console.log(`Lead: ${lead.firstName} ${lead.lastName}, Value: ${lead.estimatedValue}, Probability: ${lead.probability}%, Status: ${lead.status}`);
    });

    // FIXED: Only include leads that are NOT closed_lost in pipeline value
    const activeLeads = allLeads.filter(lead => lead.status !== 'closed_lost');
    
    const pipelineValue = activeLeads.reduce((sum, lead) => {
      const value = parseFloat(lead.estimatedValue || '0');
      const probability = lead.probability || 0;
      const leadValue = value * (probability / 100);
      
      console.log(`📊 ${lead.firstName} ${lead.lastName} (${lead.status}): $${value} × ${probability}% = $${leadValue}`);
      
      return sum + leadValue;
    }, 0);

    console.log(`💰 Total Pipeline Value: $${pipelineValue}`);
    console.log(`📈 Pipeline Value in Millions: $${(pipelineValue / 1000000).toFixed(1)}M`);

    const totalLeads = allLeads.length;
    const closedWonLeads = allLeads.filter(lead => lead.status === 'closed_won').length;
    const conversionRate = totalLeads > 0 ? (closedWonLeads / totalLeads * 100) : 0;

    const stats = {
      totalLeads,
      pipelineValue: pipelineValue >= 1000000 ? `$${(pipelineValue / 1000000).toFixed(1)}M` : `$${Math.round(pipelineValue / 1000)}K`,
      conversionRate: `${conversionRate.toFixed(1)}%`,
      closedDeals: closedWonLeads,
      leadsByStatus,
      activeCampaigns: allCampaigns.filter(c => c.status === 'active').length,
      totalCommunications: allCommunications.length,
    };

    console.log('📈 Final stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

  const httpServer = createServer(app);
  return httpServer;
}