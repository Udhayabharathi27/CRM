import DashboardStats from "@/components/DashboardStats";
import LeadsPipeline from "@/components/LeadsPipeline";
import RecentActivity from "@/components/RecentActivity";
import CampaignCard from "@/components/CampaignCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // TODO: remove mock data - replace with real data from API
  const featuredCampaigns = [
    {
      id: "1",
      name: "Spring Solar Promotion",
      subject: "Save 25% on Premium Solar Installation",
      content: "Discover our premium solar panel solutions with 25% savings for a limited time. Professional installation included.",
      status: 'active' as const,
      scheduledAt: new Date("2024-03-15T09:00:00"),
      sentAt: new Date("2024-03-15T09:00:00"),
      openRate: "41.40",
      clickRate: "12.40",
      createdBy: "user-1",
      createdAt: new Date("2024-03-10T10:00:00"),
    },
    {
      id: "2", 
      name: "Commercial Solar Solutions",
      subject: "Transform Your Business with Solar Energy",
      content: "Professional commercial solar installations to reduce your energy costs and environmental impact.",
      status: 'scheduled' as const,
      scheduledAt: new Date("2024-03-20T10:00:00"),
      sentAt: null,
      openRate: "0.00",
      clickRate: "0.00",
      createdBy: "user-1",
      createdAt: new Date("2024-03-12T14:00:00"),
    }
  ];

  const handleCampaignEdit = (id: string) => {
    console.log(`Edit campaign ${id}`);
  };

  const handleCampaignToggle = (id: string) => {
    console.log(`Toggle campaign ${id}`);
  };

  const handleCampaignView = (id: string) => {
    console.log(`View campaign ${id}`);
  };

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Overview of your solar sales pipeline and campaign performance
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadsPipeline />
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Active Campaigns</h3>
              <Button size="sm" variant="outline" data-testid="button-view-all-campaigns">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={handleCampaignEdit}
                  onToggleStatus={handleCampaignToggle}
                  onViewDetails={handleCampaignView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}