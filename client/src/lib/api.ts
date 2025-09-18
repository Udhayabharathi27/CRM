import type { Lead, InsertLead, Campaign, InsertCampaign, Communication, InsertCommunication } from "@shared/schema";

const API_BASE = '';

// Helper function for API requests
async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Leads API
export const leadsApi = {
  getAll: (filters?: { status?: string; assignedTo?: string; search?: string }): Promise<Lead[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiRequest(`/api/leads${query ? `?${query}` : ''}`);
  },

  getById: (id: string): Promise<Lead> => {
    return apiRequest(`/api/leads/${id}`);
  },

  create: (lead: InsertLead): Promise<Lead> => {
    return apiRequest('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  },

  update: (id: string, updates: Partial<InsertLead>): Promise<Lead> => {
    return apiRequest(`/api/leads/${id}`, {
      method: 'PUT', 
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiRequest(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  },

  getByStatus: (): Promise<{ status: string; count: number; totalValue: number }[]> => {
    return apiRequest('/api/leads-by-status');
  },
};

// Campaigns API
export const campaignsApi = {
  getAll: (filters?: { status?: string; createdBy?: string }): Promise<Campaign[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.createdBy) params.append('createdBy', filters.createdBy);
    
    const query = params.toString();
    return apiRequest(`/api/campaigns${query ? `?${query}` : ''}`);
  },

  getById: (id: string): Promise<Campaign> => {
    return apiRequest(`/api/campaigns/${id}`);
  },

  create: (campaign: InsertCampaign): Promise<Campaign> => {
    return apiRequest('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  },

  update: (id: string, updates: Partial<InsertCampaign>): Promise<Campaign> => {
    return apiRequest(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiRequest(`/api/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// Communications API
export const communicationsApi = {
  getAll: (leadId?: string): Promise<Communication[]> => {
    const params = new URLSearchParams();
    if (leadId) params.append('leadId', leadId);
    
    const query = params.toString();
    return apiRequest(`/api/communications${query ? `?${query}` : ''}`);
  },

  create: (communication: InsertCommunication): Promise<Communication> => {
    return apiRequest('/api/communications', {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  },

  update: (id: string, updates: Partial<InsertCommunication>): Promise<Communication> => {
    return apiRequest(`/api/communications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<{
    totalLeads: number;
    pipelineValue: string;
    conversionRate: string;
    closedDeals: number;
    leadsByStatus: { status: string; count: number; totalValue: number }[];
    activeCampaigns: number;
    totalCommunications: number;
  }> => {
    return apiRequest('/api/dashboard-stats');
  },
};