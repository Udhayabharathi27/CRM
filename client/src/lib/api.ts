import type { Lead, InsertLead, Campaign, InsertCampaign, Communication, InsertCommunication } from "@shared/schema";

const API_BASE = '';

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      if (errorData.details) {
        errorMessage += ` - ${JSON.stringify(errorData.details)}`;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const leadsApi = {
  getAll: (filters?: { status?: string; assignedTo?: string; search?: string }): Promise<Lead[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiRequest<Lead[]>(`/api/leads${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<Lead> => {
    return apiRequest<Lead>(`/api/leads/${id}`);
  },

  create: (lead: InsertLead): Promise<Lead> => {
    return apiRequest<Lead>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  },

  update: (id: string, updates: Partial<InsertLead>): Promise<Lead> => {
    return apiRequest<Lead>(`/api/leads/${id}`, {
      method: 'PUT', 
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiRequest<void>(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  },
};
// Add to api.ts, after the smsApi
export const emailApi = {
  send: (data: {
    communicationId: string;
    leadId: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    return apiRequest('/api/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
export const campaignsApi = {
  getAll: (filters?: { status?: string; createdBy?: string }): Promise<Campaign[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.createdBy) params.append('createdBy', filters.createdBy);
    
    const query = params.toString();
    return apiRequest<Campaign[]>(`/api/campaigns${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<Campaign> => {
    return apiRequest<Campaign>(`/api/campaigns/${id}`);
  },

  create: (campaign: InsertCampaign): Promise<Campaign> => {
    return apiRequest<Campaign>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  },

  update: (id: string, updates: Partial<InsertCampaign>): Promise<Campaign> => {
    return apiRequest<Campaign>(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiRequest<void>(`/api/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

export const communicationsApi = {
  getAll: (leadId?: string): Promise<Communication[]> => {
    const params = new URLSearchParams();
    if (leadId) params.append('leadId', leadId);
    
    const query = params.toString();
    return apiRequest<Communication[]>(`/api/communications${query ? `?${query}` : ''}`);
  },

  create: (communication: InsertCommunication): Promise<Communication> => {
    return apiRequest<Communication>('/api/communications', {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  },

  update: (id: string, updates: Partial<InsertCommunication>): Promise<Communication> => {
    return apiRequest<Communication>(`/api/communications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiRequest<void>(`/api/communications/${id}`, {
      method: 'DELETE',
    });
  },
};

export const smsApi = {
  send: (data: {
    communicationId: string;
    leadId: string;
    to: string;
    body: string;
  }): Promise<{
    success: boolean;
    messageId?: string;
    data?: any;
  }> => {
    return apiRequest('/api/sms/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
export const callsApi = {
  makeCall: (data: {
    communicationId: string;
    leadId: string;
    to: string;
  }): Promise<{
    success: boolean;
    callSid?: string;
    data?: any;
  }> => {
    return apiRequest('/api/calls/make-call', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const dashboardApi = {
  getStats: (): Promise<{
    totalLeads: number;
    pipelineValue: string;
    conversionRate: string;
    closedDeals: number;
    leadsByStatus: { status: string; count: number }[];
    activeCampaigns: number;
    totalCommunications: number;
  }> => {
    return apiRequest('/api/dashboard-stats');
  },
};