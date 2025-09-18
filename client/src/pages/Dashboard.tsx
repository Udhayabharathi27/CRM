import DashboardStats from "@/components/DashboardStats";
import LeadsPipeline from "@/components/LeadsPipeline";
import RecentActivity from "@/components/RecentActivity";
import CampaignCard from "@/components/CampaignCard";

export default function Dashboard() {
  // TODO: remove mock data - replace with real data from API
  const featuredCampaigns = [
    {
      id: "1",
      name: "Spring Solar Promotion",
      subject: "Save 25% on Premium Solar Installation",
      status: 'active' as const,
      scheduledAt: "Mar 15, 2024 at 9:00 AM",
      recipients: 2847,
      delivered: 2791,
      opened: 1156,
      clicked: 347,
      openRate: 41.4,
      clickRate: 12.4,
    },
    {
      id: "2", 
      name: "Commercial Solar Solutions",
      subject: "Transform Your Business with Solar Energy",
      status: 'scheduled' as const,
      scheduledAt: "Mar 20, 2024 at 10:00 AM",
      recipients: 1456,
      delivered: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0,
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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your solar sales pipeline and campaign performance
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadsPipeline />
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
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