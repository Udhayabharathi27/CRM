import { db } from './db';
import { 
  leads, 
  campaigns, 
  communications, 
  communicationMedium 
} from '@shared/schema';
import { eq, and, or, like, sql } from 'drizzle-orm';
import type { 
  InsertLead, 
  InsertCampaign, 
  InsertCommunication, 
  InsertCommunicationMedium 
} from '@shared/schema';

export interface IStorage {
  // Leads operations
  getLeads(filters?: { status?: string; assignedTo?: string; search?: string }): Promise<any[]>;
  getLead(id: string): Promise<any | null>;
  createLead(data: InsertLead): Promise<any>;
  updateLead(id: string, data: Partial<InsertLead>): Promise<any | null>;
  deleteLead(id: string): Promise<boolean>;
  getLeadsByStatus(): Promise<any[]>;


  // Campaigns operations
  getCampaigns(filters?: { status?: string; createdBy?: string }): Promise<any[]>;
  getCampaign(id: string): Promise<any | null>;
  createCampaign(data: InsertCampaign): Promise<any>;
  updateCampaign(id: string, data: Partial<InsertCampaign>): Promise<any | null>;
  deleteCampaign(id: string): Promise<boolean>;

  // Communications operations
  getCommunications(leadId?: string): Promise<any[]>;
  createCommunication(data: InsertCommunication): Promise<any>;
  updateCommunication(id: string, data: Partial<InsertCommunication>): Promise<any | null>;
  deleteCommunication(id: string): Promise<boolean>;

  // Communication Medium operations
  createCommunicationMedium(data: InsertCommunicationMedium): Promise<any>;
  getCommunicationMediumByCommunicationId(communicationId: string): Promise<any | undefined>;
  getCommunicationMediumByMessageId(mediumMessageId: string): Promise<any | undefined>;
  getAllCommunicationMedium(): Promise<any[]>;
  // Add to IStorage interface
updateCommunicationMedium(id: string, data: Partial<InsertCommunicationMedium>): Promise<any | null>;
getCommunicationMediumById(id: string): Promise<any | undefined>;
}

export const storage: IStorage = {
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
  },

  // Communication Medium operations - FIXED
  async createCommunicationMedium(data: InsertCommunicationMedium) {
    try {
      const result = await db.insert(communicationMedium).values(data).returning();
      console.log('✅ Communication medium record created:', result[0]);
      return result[0];
    } catch (error) {
      console.error('Error in createCommunicationMedium:', error);
      throw error;
    }
  },

  async getCommunicationMediumByCommunicationId(communicationId: string) {
    try {
      const [medium] = await db
        .select()
        .from(communicationMedium)
        .where(eq(communicationMedium.communicationId, communicationId))
        .limit(1);
      return medium;
    } catch (error) {
      console.error('Error in getCommunicationMediumByCommunicationId:', error);
      throw error;
    }
  },

  async getCommunicationMediumByMessageId(mediumMessageId: string) {
    try {
      const [medium] = await db
        .select()
        .from(communicationMedium)
        .where(eq(communicationMedium.mediumMessageId, mediumMessageId))
        .limit(1);
      return medium;
    } catch (error) {
      console.error('Error in getCommunicationMediumByMessageId:', error);
      throw error;
    }
  },
  // Add to storage implementation
async updateCommunicationMedium(id: string, data: Partial<InsertCommunicationMedium>) {
  try {
    const result = await db.update(communicationMedium)
      .set(data)
      .where(eq(communicationMedium.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error in updateCommunicationMedium:', error);
    throw error;
  }
},

async getCommunicationMediumById(id: string) {
  try {
    const [medium] = await db
      .select()
      .from(communicationMedium)
      .where(eq(communicationMedium.id, id))
      .limit(1);
    return medium;
  } catch (error) {
    console.error('Error in getCommunicationMediumById:', error);
    throw error;
  }
},

  async getAllCommunicationMedium() {
    try {
      return await db.select().from(communicationMedium).orderBy(communicationMedium.createdAt);
    } catch (error) {
      console.error('Error in getAllCommunicationMedium:', error);
      throw error;
    }
  }
};