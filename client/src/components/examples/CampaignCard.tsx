import CampaignCard from '../CampaignCard';

export default function CampaignCardExample() {
  // TODO: remove mock data - replace with real data from API
  const mockCampaign = {
    id: "1",
    name: "Solar Panel Spring Promotion 2024",
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
  };

  const handleEdit = (id: string) => {
    console.log(`Edit campaign ${id}`);
  };

  const handleToggleStatus = (id: string) => {
    console.log(`Toggle status for campaign ${id}`);
  };

  const handleViewDetails = (id: string) => {
    console.log(`View details for campaign ${id}`);
  };

  return (
    <div className="max-w-md">
      <CampaignCard 
        campaign={mockCampaign} 
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}