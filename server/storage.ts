import { 
  users, 
  leads, 
  campaigns, 
  communications,
  type User, 
  type InsertUser,
  type Lead,
  type InsertLead,
  type Campaign,
  type InsertCampaign,
  type Communication,
  type InsertCommunication
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leads
  getLeads(filters?: { status?: string; assignedTo?: string; search?: string }): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string): Promise<boolean>;
  getLeadsByStatus(): Promise<{ status: string; count: number; totalValue: number }[]>;
  
  // Campaigns
  getCampaigns(filters?: { status?: string; createdBy?: string }): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<boolean>;
  
  // Communications
  getCommunications(leadId?: string): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  updateCommunication(id: string, updates: Partial<InsertCommunication>): Promise<Communication>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Leads
  async getLeads(filters?: { status?: string; assignedTo?: string; search?: string }): Promise<Lead[]> {
    const baseQuery = db.select().from(leads);
    
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status as any));
    }
    
    if (filters?.assignedTo) {
      conditions.push(eq(leads.assignedTo, filters.assignedTo));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(leads.firstName, `%${filters.search}%`),
          like(leads.lastName, `%${filters.search}%`),
          like(leads.company, `%${filters.search}%`),
          like(leads.email, `%${filters.search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      return baseQuery.where(and(...conditions)).orderBy(desc(leads.updatedAt));
    }
    
    return baseQuery.orderBy(desc(leads.updatedAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values({
        ...insertLead,
        updatedAt: new Date(),
      })
      .returning();
    return lead;
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getLeadsByStatus(): Promise<{ status: string; count: number; totalValue: number }[]> {
    const result = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .groupBy(leads.status);
    
    return result.map(row => ({
      status: row.status,
      count: row.count,
      totalValue: 0, // TODO: implement sum calculation
    }));
  }

  // Campaigns
  async getCampaigns(filters?: { status?: string; createdBy?: string }): Promise<Campaign[]> {
    const baseQuery = db.select().from(campaigns);
    
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(campaigns.status, filters.status as any));
    }
    
    if (filters?.createdBy) {
      conditions.push(eq(campaigns.createdBy, filters.createdBy));
    }
    
    if (conditions.length > 0) {
      return baseQuery.where(and(...conditions)).orderBy(desc(campaigns.createdAt));
    }
    
    return baseQuery.orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<Campaign> {
    const [campaign] = await db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    const result = await db.delete(campaigns).where(eq(campaigns.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Communications
  async getCommunications(leadId?: string): Promise<Communication[]> {
    const baseQuery = db.select().from(communications);
    
    if (leadId) {
      return baseQuery.where(eq(communications.leadId, leadId)).orderBy(desc(communications.createdAt));
    }
    
    return baseQuery.orderBy(desc(communications.createdAt));
  }

  async createCommunication(insertCommunication: InsertCommunication): Promise<Communication> {
    const [communication] = await db
      .insert(communications)
      .values(insertCommunication)
      .returning();
    return communication;
  }

  async updateCommunication(id: string, updates: Partial<InsertCommunication>): Promise<Communication> {
    const [communication] = await db
      .update(communications)
      .set(updates)
      .where(eq(communications.id, id))
      .returning();
    return communication;
  }
}

export const storage = new DatabaseStorage();