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
      
    }
  }
}

async function handleSuccess(communicationId: string, leadId: string, result: any) {
  try {
    await storage.updateCommunication(communicationId, {
      completedAt: new Date()
    });
    console.log('✅ Communication marked as completed');
  } catch (updateError) {
    console.error('❌ Failed to update communication:', updateError);
  }
  
  try {
    const mediumRecord = await storage.createCommunicationMedium({
      leadId: leadId,
      communicationId: communicationId,
      mediumType: 'SMS',
      mediumId: null,
      mediumMessageId: result.messageId || `sms-${Date.now()}`,
      response: JSON.stringify(result)
    });
    console.log('📊 STORED IN communication-medium TABLE:', mediumRecord);
  } catch (mediumError) {
    console.error('❌ Failed to create communication-medium record:', mediumError);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  if (process.env.NODE_ENV === 'development') {
    await seedUsers();
  }

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

  // Voice Call API Endpoint
  app.post("/api/calls/make-call", async (req, res) => {
    console.log('📞 Received Voice Call request');
    
    try {
      const { communicationId, leadId, to } = req.body;
      
      console.log('Request body:', { communicationId, leadId, to });

      // Validate required fields
      if (!to || !communicationId || !leadId) {
        return res.status(400).json({ error: "Missing required fields: to, communicationId, leadId" });
      }

      // Validate phone number format
      const cleanPhone = to.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      console.log('📤 Calling Voice Call API...');
      
      // Format phone number for Twilio
      let formattedPhone;
      if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
        formattedPhone = `+${cleanPhone}`;
      }
      else if (cleanPhone.length === 10) {
        formattedPhone = `+91${cleanPhone}`;
      }
      else {
        formattedPhone = `+${cleanPhone}`;
      }
      
      console.log('🔍 Phone number transformation:', { 
        original: to, 
        cleaned: cleanPhone, 
        formatted: formattedPhone 
      });
      
      // Call the external Voice Call API
      const response = await fetch('https://waba-api.nitinnovtech.com/api/calls/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhone
        }),
      });

      console.log('📞 Voice Call API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Voice Call API HTTP error:', response.status, errorText);
        throw new Error(`Voice Call API returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('📞 Voice Call API raw response:', JSON.stringify(result, null, 2));

      // Check for successful Voice Call response
      if (result.success && result.callSid) {
        console.log('✅ Voice call initiated successfully, Call SID:', result.callSid);
        
        // Update communication as completed
        try {
          await storage.updateCommunication(communicationId, {
            completedAt: new Date()
          });
          console.log('✅ Communication marked as completed');
        } catch (updateError) {
          console.error('❌ Failed to update communication:', updateError);
        }
        
        // Store the response in communication-medium table
        try {
          const mediumRecord = await storage.createCommunicationMedium({
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Voice Call',
            mediumId: result.callSid,
            mediumMessageId: `call-${Date.now()}`,
            response: JSON.stringify({
              externalApiResponse: result,
              callSid: result.callSid,
              sentTo: formattedPhone,
              timestamp: new Date().toISOString(),
              httpStatus: response.status
            })
          });
          console.log('📊 STORED IN communication-medium TABLE:', {
            id: mediumRecord.id,
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Voice Call',
            mediumId: result.callSid,
            mediumMessageId: `call-${Date.now()}`
          });
        } catch (mediumError) {
          console.error('❌ Failed to create communication-medium record:', mediumError);
        }
        
        // Return success response
        res.json({
          success: true,
          callSid: result.callSid,
          data: result
        });
        
      } else {
        console.error('❌ Voice Call API returned error:', result);
        
        // Store the error in communication-medium table
        try {
          const mediumRecord = await storage.createCommunicationMedium({
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Voice Call',
            mediumId: null,
            mediumMessageId: `call-failed-${Date.now()}`,
            response: JSON.stringify({
              externalApiResponse: result,
              sentTo: formattedPhone,
              timestamp: new Date().toISOString(),
              httpStatus: response.status,
              error: result.error || 'Voice call initiation failed'
            })
          });
          console.log('📊 STORED VOICE CALL ERROR IN communication-medium TABLE');
        } catch (mediumError) {
          console.error('❌ Failed to create communication-medium error record:', mediumError);
        }
        
        res.status(500).json({ 
          error: "Voice call initiation failed",
          details: result 
        });
      }

    } catch (error: any) {
      console.error('❌ Voice call failed:', error.message);
      
      // Store the exception in communication-medium table
      try {
        const mediumRecord = await storage.createCommunicationMedium({
          leadId: req.body.leadId,
          communicationId: req.body.communicationId,
          mediumType: 'Voice Call',
          mediumId: null,
          mediumMessageId: `call-exception-${Date.now()}`,
          response: JSON.stringify({
            error: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
          })
        });
        console.log('📊 STORED VOICE CALL EXCEPTION IN communication-medium TABLE');
      } catch (mediumError) {
        console.error('❌ Failed to create communication-medium exception record:', mediumError);
      }
      
      res.status(500).json({ 
        error: "Internal server error while processing voice call",
        details: error.message 
      });
    }
  });

  app.post("/api/whatsapp/send", async (req, res) => {
    console.log('📱 Received WhatsApp send request');
    
    try {
      const { communicationId, leadId, to, message } = req.body;
      
      console.log('Request body:', { communicationId, leadId, to, message });

      if (!to || !message || !communicationId || !leadId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const cleanPhone = to.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      console.log('📤 Calling WhatsApp API...');
      
      const response = await fetch('https://waba-api.nitinnovtech.com/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          communicationId,
          leadId,
          to: cleanPhone,
          message
        }),
      });

      console.log('📱 WhatsApp API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ WhatsApp API HTTP error:', response.status, errorText);
        throw new Error(`WhatsApp API returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('📱 WhatsApp API raw response:', JSON.stringify(result, null, 2));

      const insertedRecord = result.insertedRecord;
      const whatsappData = result.data;

      if (whatsappData && whatsappData.messages && whatsappData.messages.length > 0 && whatsappData.messages[0].id) {
        console.log('✅ WhatsApp message sent successfully, ID:', whatsappData.messages[0].id);
        
        try {
          await storage.updateCommunication(communicationId, {
            completedAt: new Date()
          });
          console.log('✅ Communication marked as completed');
        } catch (updateError) {
          console.error('❌ Failed to update communication:', updateError);
        }
        
        try {
          const mediumRecord = await storage.createCommunicationMedium({
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Whatsapp',
            mediumId: null,
            mediumMessageId: whatsappData.messages[0].id,
            response: JSON.stringify(result)
          });
          console.log('📊 STORED IN communication-medium TABLE:', {
            id: mediumRecord.id,
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Whatsapp',
            mediumId: null,
            mediumMessageId: whatsappData.messages[0].id
          });
        } catch (mediumError) {
          console.error('❌ Failed to create communication-medium record:', mediumError);
        }
        
        res.json({
          success: true,
          insertedRecord: insertedRecord,
          data: {
            messaging_product: whatsappData.messaging_product,
            contacts: whatsappData.contacts,
            messages: whatsappData.messages
          }
        });
        
      } else {
        console.error('❌ WhatsApp response missing message ID:', result);
        res.status(500).json({ 
          error: "WhatsApp response missing message ID",
          details: result 
        });
      }

    } catch (error: any) {
      console.error('❌ WhatsApp sending failed:', error.message);
      res.status(500).json({ 
        error: "Internal server error while processing WhatsApp message",
        details: error.message 
      });
    }
  });

  app.post("/api/sms/send", async (req, res) => {
  console.log('📱 Received SMS send request');
  
  try {
    const { communicationId, leadId, to, body } = req.body;
    
    console.log('Request body from frontend:', { communicationId, leadId, to, body });

    if (!to || !body || !communicationId || !leadId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cleanPhone = to.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    console.log('📤 Calling SMS API...');
    
    let formattedPhone;
    
    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      formattedPhone = `+${cleanPhone}`;
    }
    else if (cleanPhone.length === 10) {
      formattedPhone = `+91${cleanPhone}`;
    }
    else {
      formattedPhone = `+${cleanPhone}`;
    }
    
    console.log('🔍 Phone number transformation:', { 
      original: to, 
      cleaned: cleanPhone, 
      formatted: formattedPhone 
    });
    
    const externalApiPayload = {
      to: formattedPhone,
      body: body
    };
    
    console.log('📤 Payload to external API:', externalApiPayload);
    
    const response = await fetch('https://waba-api.nitinnovtech.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(externalApiPayload),
    });

    console.log('📱 SMS API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SMS API HTTP error:', response.status, errorText);
      
      if (errorText.includes('unverified') && errorText.includes('Trial accounts')) {
        console.log('🔔 Twilio trial account limitation detected');
        
        try {
          await storage.updateCommunication(communicationId, {
            completedAt: new Date()
          });
          console.log('✅ Communication marked as completed (with limitation)');
        } catch (updateError) {
          console.error('❌ Failed to update communication:', updateError);
        }
        
        try {
          const mediumRecord = await storage.createCommunicationMedium({
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'SMS',
            mediumId: null,
            mediumMessageId: `sms-failed-${Date.now()}`,
            response: JSON.stringify({
              error: "Twilio trial account limitation",
              message: "Trial accounts can only send to verified numbers. Please verify this number in Twilio or upgrade your account.",
              phoneNumber: formattedPhone
            })
          });
          console.log('📊 STORED FAILED communication-medium record');
        } catch (mediumError) {
          console.error('❌ Failed to create communication-medium record:', mediumError);
        }
        
        return res.status(400).json({
          success: false,
          error: "Twilio Account Limitation",
          message: "Trial accounts can only send SMS to verified phone numbers. Please verify this number in your Twilio account or contact the administrator.",
          details: {
            phoneNumber: formattedPhone,
            requirement: "Number must be verified in Twilio console"
          }
        });
      }
      
      throw new Error(`SMS API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📱 SMS API raw response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ SMS sent successfully');
      await handleSuccess(communicationId, leadId, result);
      
      res.json({
        success: true,
        messageId: result.messageId,
        data: result
      });
      
    } else {
      console.error('❌ SMS API returned error:', result);
      res.status(500).json({ 
        error: "SMS sending failed",
        details: result 
      });
    }

  } catch (error: any) {
    console.error('❌ SMS sending failed:', error.message);
    res.status(500).json({ 
      error: "Internal server error while processing SMS",
      details: error.message 
    });
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

  app.post("/api/email/send", async (req, res) => {
    console.log('📧 Received Email send request');
    
    try {
      const { communicationId, leadId, to, subject, text, html } = req.body;
      
      console.log('Request body:', { communicationId, leadId, to, subject });

      // Validate required fields
      if (!to || !subject || (!text && !html) || !communicationId || !leadId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      console.log('📤 Calling Email API...');
      
      // Call the external Email API
      const response = await fetch('https://waba-api.nitinnovtech.com/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          text: text || '',
          html: html || ''
        }),
      });

      console.log('📧 Email API response status:', response.status);
      
      const responseText = await response.text();
      console.log('📧 Email API raw response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse Email API response:', parseError);
        result = { rawResponse: responseText };
      }

      console.log('📧 Email API parsed response:', JSON.stringify(result, null, 2));

      // Check for successful Email response
      if (response.ok && result.message === "Email sent successfully!") {
        console.log('✅ Email sent successfully');
        
        // Update communication as completed
        try {
          await storage.updateCommunication(communicationId, {
            completedAt: new Date()
          });
          console.log('✅ Communication marked as completed');
        } catch (updateError) {
          console.error('❌ Failed to update communication:', updateError);
        }
        
        // Store the COMPLETE response in communication-medium table
        try {
          const mediumRecord = await storage.createCommunicationMedium({
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Email',
            mediumId: null,
            mediumMessageId: `email-${Date.now()}`,
            response: JSON.stringify({
              externalApiResponse: result,
              sentTo: to,
              subject: subject,
              timestamp: new Date().toISOString(),
              httpStatus: response.status,
              rawResponse: responseText
            })
          });
          console.log('📊 STORED COMPLETE EMAIL RESPONSE IN communication-medium TABLE:', mediumRecord);
        } catch (mediumError) {
          console.error('❌ Failed to create communication-medium record:', mediumError);
        }
        
        // Return success response
        res.json({
          success: true,
          message: "Email sent successfully",
          data: result
        });
        
      } else {
        console.error('❌ Email API returned error:', result);
        
        // Store the ERROR response in communication-medium table
        try {
          const mediumRecord = await storage.createCommunicationMedium({
            leadId: leadId,
            communicationId: communicationId,
            mediumType: 'Email',
            mediumId: null,
            mediumMessageId: `email-failed-${Date.now()}`,
            response: JSON.stringify({
              externalApiResponse: result,
              sentTo: to,
              subject: subject,
              timestamp: new Date().toISOString(),
              httpStatus: response.status,
              rawResponse: responseText,
              error: result.error || result.message || 'Unknown error'
            })
          });
          console.log('📊 STORED EMAIL ERROR IN communication-medium TABLE:', mediumRecord);
        } catch (mediumError) {
          console.error('❌ Failed to create communication-medium error record:', mediumError);
        }
        
        res.status(500).json({ 
          error: "Email sending failed",
          details: result 
        });
      }

    } catch (error: any) {
      console.error('❌ Email sending failed:', error.message);
      
      // Store the EXCEPTION response in communication-medium table
      try {
        const mediumRecord = await storage.createCommunicationMedium({
          leadId: req.body.leadId,
          communicationId: req.body.communicationId,
          mediumType: 'Email',
          mediumId: null,
          mediumMessageId: `email-exception-${Date.now()}`,
          response: JSON.stringify({
            error: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
          })
        });
        console.log('📊 STORED EMAIL EXCEPTION IN communication-medium TABLE:', mediumRecord);
      } catch (mediumError) {
        console.error('❌ Failed to create communication-medium exception record:', mediumError);
      }
      
      res.status(500).json({ 
        error: "Internal server error while processing Email",
        details: error.message 
      });
    }
  });

  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const leadsByStatus = await storage.getLeadsByStatus();
      const allLeads = await storage.getLeads();
      const allCampaigns = await storage.getCampaigns();
      const allCommunications = await storage.getCommunications();

      console.log('🔍 Leads data for pipeline calculation:');
      allLeads.forEach(lead => {
        console.log(`Lead: ${lead.firstName} ${lead.lastName}, Value: ${lead.estimatedValue}, Probability: ${lead.probability}%, Status: ${lead.status}`);
      });
      

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