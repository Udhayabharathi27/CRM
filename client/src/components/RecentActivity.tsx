import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  FileText,
  Clock
} from "lucide-react";

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'proposal';
  title: string;
  description: string;
  leadName: string;
  leadCompany: string;
  userAvatar?: string;
  userName: string;
  timestamp: string;
  status?: 'completed' | 'scheduled' | 'pending';
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'call': return <Phone className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'meeting': return <Calendar className="h-4 w-4" />;
    case 'note': return <MessageSquare className="h-4 w-4" />;
    case 'proposal': return <FileText className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
}

function getActivityColor(type: Activity['type']) {
  switch (type) {
    case 'call': return 'bg-chart-1 text-white';
    case 'email': return 'bg-chart-2 text-black';
    case 'meeting': return 'bg-chart-3 text-white';
    case 'note': return 'bg-chart-4 text-white';
    case 'proposal': return 'bg-chart-5 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
}

function getStatusBadge(status?: Activity['status']) {
  if (!status) return null;
  
  const variants = {
    completed: 'bg-chart-3 text-white',
    scheduled: 'bg-chart-4 text-white',
    pending: 'bg-chart-2 text-black',
  };
  
  return (
    <Badge className={variants[status]} data-testid={`badge-status-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-4 p-4 hover-elevate rounded-lg border border-border/40 transition-all duration-200 group" data-testid={`activity-item-${activity.id}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-sm ${getActivityColor(activity.type)} group-hover:scale-105 transition-transform duration-200`}>
        {getActivityIcon(activity.type)}
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground truncate leading-5" data-testid={`text-activity-title-${activity.id}`}>
            {activity.title}
          </h4>
          {getStatusBadge(activity.status)}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {activity.description}
        </p>
        
        <div className="flex items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-foreground/90 truncate">{activity.leadName}</span>
            <span className="text-muted-foreground/80 hidden sm:inline">•</span>
            <span className="text-muted-foreground/80 truncate hidden sm:inline">{activity.leadCompany}</span>
          </div>
          <span className="text-muted-foreground/70 text-xs font-medium whitespace-nowrap" data-testid={`text-timestamp-${activity.id}`}>
            {activity.timestamp}
          </span>
        </div>
        
        <div className="flex items-center gap-2 pt-1">
          <Avatar className="h-6 w-6 border border-border/40">
            <AvatarImage src={activity.userAvatar} />
            <AvatarFallback className="text-xs font-medium bg-muted">
              {activity.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground/80 font-medium">by {activity.userName}</span>
        </div>
      </div>
    </div>
  );
}

export default function RecentActivity() {
  // TODO: remove mock data - replace with real data from API
  const activities: Activity[] = [
    {
      id: "1",
      type: "call",
      title: "Follow-up Call Completed",
      description: "Discussed solar panel options and financing. Customer interested in 25kW system.",
      leadName: "Sarah Johnson",
      leadCompany: "GreenTech Industries",
      userName: "Mike Davis",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "email",
      title: "Proposal Sent",
      description: "Sent detailed proposal for 40kW commercial solar installation with ROI analysis.",
      leadName: "Robert Wilson",
      leadCompany: "Solar Dynamics",
      userName: "Lisa Chen",
      timestamp: "4 hours ago",
      status: "pending",
    },
    {
      id: "3",
      type: "meeting",
      title: "Site Visit Scheduled",
      description: "Scheduled on-site assessment for next Tuesday at 2:00 PM.",
      leadName: "Jennifer Lee",
      leadCompany: "Sustainable Systems",
      userName: "John Smith",
      timestamp: "6 hours ago",
      status: "scheduled",
    },
    {
      id: "4",
      type: "note",
      title: "Lead Qualification Updated",
      description: "Updated lead score based on budget confirmation and decision timeline.",
      leadName: "David Brown",
      leadCompany: "Future Solar",
      userName: "Emily Rodriguez",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: "5",
      type: "proposal",
      title: "Contract Signed",
      description: "Customer signed 156kW commercial installation contract. Project starts next month.",
      leadName: "Mark Thompson",
      leadCompany: "Energy Efficient Inc",
      userName: "Alex Johnson",
      timestamp: "2 days ago",
      status: "completed",
    }
  ];

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl font-bold text-foreground">Recent Activity</CardTitle>
          <Button size="sm" variant="outline" data-testid="button-view-all-activity">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}