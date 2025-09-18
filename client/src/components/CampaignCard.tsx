import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Eye, 
  MousePointer, 
  Calendar, 
  Play, 
  Pause, 
  Edit,
  MoreHorizontal 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

function getStatusColor(status: Campaign['status']) {
  switch (status) {
    case 'draft': return 'bg-muted text-muted-foreground';
    case 'scheduled': return 'bg-chart-4 text-white';
    case 'active': return 'bg-chart-3 text-white';
    case 'paused': return 'bg-chart-2 text-black';
    case 'completed': return 'bg-chart-1 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
}

function getStatusLabel(status: Campaign['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function CampaignCard({ 
  campaign, 
  onEdit, 
  onToggleStatus, 
  onViewDetails 
}: CampaignCardProps) {
  const handleAction = (action: string) => {
    console.log(`Campaign ${action} triggered for ${campaign.id}`);
    
    switch (action) {
      case 'edit':
        onEdit?.(campaign.id);
        break;
      case 'toggle':
        onToggleStatus?.(campaign.id);
        break;
      case 'view':
        onViewDetails?.(campaign.id);
        break;
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-campaign-${campaign.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base line-clamp-2" data-testid={`text-campaign-name-${campaign.id}`}>
              {campaign.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {campaign.subject}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={getStatusColor(campaign.status)}
              data-testid={`badge-status-${campaign.id}`}
            >
              {getStatusLabel(campaign.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  data-testid={`button-menu-${campaign.id}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction('view')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('edit')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Campaign
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('toggle')}>
                  {campaign.status === 'active' ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Campaign
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Campaign
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {campaign.scheduledAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Scheduled: {campaign.scheduledAt}</span>
          </div>
        )}
        
        {campaign.status !== 'draft' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sent</span>
                <span className="font-medium" data-testid={`text-sent-${campaign.id}`}>
                  {campaign.delivered.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Opens
                </span>
                <span className="font-medium" data-testid={`text-opens-${campaign.id}`}>
                  {campaign.openRate}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recipients</span>
                <span className="font-medium">
                  {campaign.recipients.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MousePointer className="h-3 w-3" />
                  Clicks
                </span>
                <span className="font-medium" data-testid={`text-clicks-${campaign.id}`}>
                  {campaign.clickRate}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {campaign.status !== 'draft' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Open Rate</span>
              <span>{campaign.openRate}%</span>
            </div>
            <Progress value={campaign.openRate} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>Email Campaign</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleAction('view')}
            data-testid={`button-view-details-${campaign.id}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}