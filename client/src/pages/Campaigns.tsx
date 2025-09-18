import CampaignCard from "@/components/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, BarChart } from "lucide-react";

export default function Campaigns() {
  // TODO: remove mock data - replace with real data from API
  const campaigns = [
    {
      id: "1",
      name: "Spring Solar Promotion 2024",
      subject: "Save 25% on Premium Solar Installation This Spring",
      status: 'active' as const,
      scheduledAt: "Mar 15, 2024 at 9:00 AM",
      sentAt: "Mar 15, 2024 at 9:00 AM",
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
    },
    {
      id: "3",
      name: "Residential Solar Upgrade",
      subject: "Upgrade to Smart Solar Technology",
      status: 'completed' as const,
      sentAt: "Mar 1, 2024 at 9:00 AM",
      recipients: 3254,
      delivered: 3189,
      opened: 1847,
      clicked: 623,
      openRate: 57.9,
      clickRate: 19.5,
    },
    {
      id: "4",
      name: "Summer Solar Campaign",
      subject: "Beat the Heat with Solar Power",
      status: 'draft' as const,
      recipients: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0,
    },
    {
      id: "5",
      name: "Q4 Solar Incentives",
      subject: "Last Chance for Federal Tax Credits",
      status: 'paused' as const,
      sentAt: "Dec 1, 2023 at 10:00 AM",
      recipients: 1987,
      delivered: 1923,
      opened: 865,
      clicked: 234,
      openRate: 45.0,
      clickRate: 12.1,
    }
  ];

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-campaigns-title">
            Marketing Campaigns
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and track your email marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            data-testid="button-view-analytics"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button 
            size="sm"
            data-testid="button-create-campaign"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            data-testid="input-search-campaigns"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          data-testid="button-filter-campaigns"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" data-testid="tabs-campaigns">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-campaigns">
            All ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active-campaigns">
            Active ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" data-testid="tab-scheduled-campaigns">
            Scheduled ({scheduledCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed-campaigns">
            Completed ({completedCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="draft" data-testid="tab-draft-campaigns">
            Drafts ({draftCampaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleCampaignEdit}
                onToggleStatus={handleCampaignToggle}
                onViewDetails={handleCampaignView}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleCampaignEdit}
                onToggleStatus={handleCampaignToggle}
                onViewDetails={handleCampaignView}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scheduledCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleCampaignEdit}
                onToggleStatus={handleCampaignToggle}
                onViewDetails={handleCampaignView}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleCampaignEdit}
                onToggleStatus={handleCampaignToggle}
                onViewDetails={handleCampaignView}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {draftCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={handleCampaignEdit}
                onToggleStatus={handleCampaignToggle}
                onViewDetails={handleCampaignView}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}