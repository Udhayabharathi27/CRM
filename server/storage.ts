// storage.ts
import { db } from './db';
import { leads, campaigns, communications } from '@shared/schema';
import { eq, and, or, like, sql } from 'drizzle-orm';
import type { InsertLead, InsertCampaign, InsertCommunication } from '@shared/schema';

export const storage = {
  // Leads operations
  async getLeads(filters?: { status?: string; assignedTo?: string; search?: string }) {
    try {
      let query = db.select().from(leads);
      
      if (filters?.status) {
        query = query.where(eq(leads.status, filters.status));
      }
      
      if (filters?.assignedTo) {
        query = query.where(eq(leads.assignedTo, filters.assignedTo));
      }
      
      if (filters?.search) {
        query = query.where(
          or(
            like(leads.firstName, `%${filters.search}%`),
            like(leads.lastName, `%${filters.search}%`),
            like(leads.email, `%${filters.search}%`),
            like(leads.company, `%${filters.search}%`)
          )
        );
      }
      
      return await query;
    } catch (error) {
      console.error('Error in getLeads:', error);
      throw error;
    }
  },

  async getLead(id: string) {
    try {
      const result = await db.select().from(leads).where(eq(leads.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error in getLead:', error);
      throw error;
    }
  },

  async createLead(data: InsertLead) {
    try {
      console.log('Creating lead with data:', data);
      const result = await db.insert(leads).values(data).returning();
      console.log('Lead created successfully:', result[0]);
      return result[0];
    } catch (error) {
      console.error('Error in createLead:', error);
      throw error;
    }
  },

  async updateLead(id: string, data: Partial<InsertLead>) {
    try {
      const result = await db.update(leads)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(leads.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error in updateLead:', error);
      throw error;
    }
  },

  async deleteLead(id: string) {
    try {
      const result = await db.delete(leads).where(eq(leads.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error in deleteLead:', error);
      throw error;
    }
  },

  async getLeadsByStatus() {
    try {
      const result = await db
        .select({
          status: leads.status,
          count: sql<number>`count(*)`
        })
        .from(leads)
        .groupBy(leads.status);
      
      return result;
    } catch (error) {
      console.error('Error in getLeadsByStatus:', error);
      throw error;
    }
  },

  // Campaigns operations
  async getCampaigns(filters?: { status?: string; createdBy?: string }) {
    try {
      let query = db.select().from(campaigns);
      
      if (filters?.status) {
        query = query.where(eq(campaigns.status, filters.status));
      }
      
      if (filters?.createdBy) {
        query = query.where(eq(campaigns.createdBy, filters.createdBy));
      }
      
      return await query;
    } catch (error) {
      console.error('Error in getCampaigns:', error);
      throw error;
    }
  },

  async getCampaign(id: string) {
    try {
      const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error in getCampaign:', error);
      throw error;
    }
  },

  async createCampaign(data: InsertCampaign) {
    try {
      const result = await db.insert(campaigns).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error in createCampaign:', error);
      throw error;
    }
  },

  async updateCampaign(id: string, data: Partial<InsertCampaign>) {
    try {
      const result = await db.update(campaigns)
        .set(data)
        .where(eq(campaigns.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error in updateCampaign:', error);
      throw error;
    }
  },

  async deleteCampaign(id: string) {
    try {
      const result = await db.delete(campaigns).where(eq(campaigns.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error in deleteCampaign:', error);
      throw error;
    }
  },

  // Communications operations
  async getCommunications(leadId?: string) {
    try {
      let query = db.select().from(communications);
      
      if (leadId) {
        query = query.where(eq(communications.leadId, leadId));
      }
      
      return await query;
    } catch (error) {
      console.error('Error in getCommunications:', error);
      throw error;
    }
  },

  async createCommunication(data: InsertCommunication) {
    try {
      const result = await db.insert(communications).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error in createCommunication:', error);
      throw error;
    }
  },

  async updateCommunication(id: string, data: Partial<InsertCommunication>) {
    try {
      const result = await db.update(communications)
        .set(data)
        .where(eq(communications.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error in updateCommunication:', error);
      throw error;
    }
  },

  async deleteCommunication(id: string) {
    try {
      const result = await db.delete(communications).where(eq(communications.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error in deleteCommunication:', error);
      throw error;
    }
  }
};