import { db } from "./db";
import { users, leads, campaigns, communications } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const createdUsers = await db.insert(users).values([
      {
        username: "admin",
        email: "admin@solarpanel.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User", 
        role: "admin",
      },
      {
        username: "johndoe",
        email: "john.doe@solarpanel.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        role: "sales",
      },
      {
        username: "jansmith",
        email: "jane.smith@solarpanel.com",
        password: hashedPassword,
        firstName: "Jane", 
        lastName: "Smith",
        role: "marketing",
      },
      {
        username: "mikejohnson",
        email: "mike.johnson@solarpanel.com",
        password: hashedPassword,
        firstName: "Mike",
        lastName: "Johnson",
        role: "sales",
      }
    ]).returning();

    console.log(`Created ${createdUsers.length} users`);

    // Create leads
    const createdLeads = await db.insert(leads).values([
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@greentech.com",
        phone: "+1-555-0101",
        company: "GreenTech Industries",
        address: "123 Business Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        status: "new",
        source: "web form",
        estimatedValue: "25000.00",
        probability: 25,
        assignedTo: createdUsers[1].id, // John Doe
        notes: "Interested in commercial solar installation for office building"
      },
      {
        firstName: "Robert",
        lastName: "Wilson",
        email: "robert.wilson@solardynamics.com",
        phone: "+1-555-0102",
        company: "Solar Dynamics",
        address: "456 Green St",
        city: "Austin", 
        state: "TX",
        zipCode: "73301",
        status: "contacted",
        source: "referral",
        estimatedValue: "67000.00",
        probability: 50,
        assignedTo: createdUsers[1].id, // John Doe
        notes: "Needs proposal for 40kW system. Decision maker confirmed."
      },
      {
        firstName: "Jennifer",
        lastName: "Lee",
        email: "jennifer.lee@sustainablesystems.com",
        phone: "+1-555-0103",
        company: "Sustainable Systems",
        address: "789 Eco Way",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        status: "proposal",
        source: "cold call",
        estimatedValue: "156000.00",
        probability: 80,
        assignedTo: createdUsers[3].id, // Mike Johnson
        notes: "Large commercial project. Proposal sent, waiting for board approval."
      },
      {
        firstName: "David",
        lastName: "Brown", 
        email: "david.brown@futuresolar.com",
        phone: "+1-555-0104",
        company: "Future Solar",
        address: "321 Innovation Dr",
        city: "Denver",
        state: "CO",
        zipCode: "80202",
        status: "proposal",
        source: "trade show",
        estimatedValue: "89000.00",
        probability: 75,
        assignedTo: createdUsers[3].id, // Mike Johnson
        notes: "Ready to move forward. Financing options discussed."
      },
      {
        firstName: "Mark",
        lastName: "Thompson",
        email: "mark.thompson@energyefficient.com",
        phone: "+1-555-0105",
        company: "Energy Efficient Inc",
        address: "654 Power Blvd",
        city: "Phoenix",
        state: "AZ",
        zipCode: "85001",
        status: "closed_won",
        source: "referral",
        estimatedValue: "125000.00",
        probability: 100,
        assignedTo: createdUsers[1].id, // John Doe
        notes: "Contract signed! Installation scheduled for next month."
      }
    ]).returning();

    console.log(`Created ${createdLeads.length} leads`);

    // Create campaigns
    const createdCampaigns = await db.insert(campaigns).values([
      {
        name: "Spring Solar Promotion 2024",
        subject: "Save 25% on Premium Solar Installation This Spring",
        content: "Take advantage of our spring promotion and federal tax incentives...",
        status: "active",
        scheduledAt: new Date("2024-03-15T09:00:00Z"),
        createdBy: createdUsers[2].id, // Jane Smith
      },
      {
        name: "Commercial Solar Solutions",
        subject: "Transform Your Business with Solar Energy",
        content: "Reduce your energy costs and carbon footprint with our commercial solutions...",
        status: "scheduled",
        scheduledAt: new Date("2024-03-20T10:00:00Z"),
        createdBy: createdUsers[2].id, // Jane Smith
      },
      {
        name: "Residential Solar Upgrade",
        subject: "Upgrade to Smart Solar Technology",
        content: "Smart inverters and monitoring systems now available...",
        status: "completed",
        sentAt: new Date("2024-03-01T09:00:00Z"),
        openRate: "57.90",
        clickRate: "19.50",
        createdBy: createdUsers[2].id, // Jane Smith
      }
    ]).returning();

    console.log(`Created ${createdCampaigns.length} campaigns`);

    // Create communications
    const createdCommunications = await db.insert(communications).values([
      {
        leadId: createdLeads[0].id,
        userId: createdUsers[1].id, // John Doe
        type: "call",
        subject: "Initial contact call",
        content: "Discussed solar panel options and financing. Customer interested in 25kW system.",
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        leadId: createdLeads[1].id,
        userId: createdUsers[1].id, // John Doe
        type: "email",
        subject: "Proposal sent",
        content: "Sent detailed proposal for 40kW commercial solar installation with ROI analysis.",
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        leadId: createdLeads[2].id,
        userId: createdUsers[3].id, // Mike Johnson
        type: "meeting",
        subject: "Site visit scheduled",
        content: "Scheduled on-site assessment for next Tuesday at 2:00 PM.",
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        leadId: createdLeads[4].id,
        userId: createdUsers[1].id, // John Doe
        type: "note",
        subject: "Contract signed",
        content: "Customer signed 125kW commercial installation contract. Project starts next month.",
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      }
    ]).returning();

    console.log(`Created ${createdCommunications.length} communications`);

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
seed().catch(console.error);

export { seed };