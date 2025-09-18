import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Phone, Mail, Calendar } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  value: string;
  probability: number;
  lastContact: string;
  avatar?: string;
}

interface PipelineStageProps {
  title: string;
  count: number;
  totalValue: string;
  leads: Lead[];
  color: string;
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card className="mb-3 hover-elevate" data-testid={`card-lead-${lead.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={lead.avatar} />
              <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm" data-testid={`text-lead-name-${lead.id}`}>{lead.name}</div>
              <div className="text-xs text-muted-foreground">{lead.company}</div>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">{lead.probability}%</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-chart-1">
            <DollarSign className="h-3 w-3" />
            <span data-testid={`text-lead-value-${lead.id}`}>{lead.value}</span>
          </div>
          <div className="text-xs text-muted-foreground">{lead.lastContact}</div>
        </div>
        <div className="flex gap-1 mt-3">
          <Button size="sm" variant="outline" className="h-7 text-xs" data-testid={`button-call-${lead.id}`}>
            <Phone className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" data-testid={`button-email-${lead.id}`}>
            <Mail className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" data-testid={`button-schedule-${lead.id}`}>
            <Calendar className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineStage({ title, count, totalValue, leads, color }: PipelineStageProps) {
  return (
    <div className="flex-1 min-w-[280px]">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${color}`}></div>
              {title}
            </CardTitle>
            <Badge variant="secondary" data-testid={`badge-count-${title.toLowerCase().replace(' ', '-')}`}>
              {count}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground" data-testid={`text-total-value-${title.toLowerCase().replace(' ', '-')}`}>
            Total: {totalValue}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LeadsPipeline() {
  // TODO: remove mock data - replace with real data from API
  const pipelineStages = [
    {
      title: "New Leads",
      count: 47,
      totalValue: "$284K",
      color: "bg-chart-2",
      leads: [
        {
          id: "1",
          name: "Sarah Johnson",
          company: "GreenTech Industries",
          value: "$25K",
          probability: 25,
          lastContact: "2 hours ago",
        },
        {
          id: "2", 
          name: "Mike Chen",
          company: "EcoSolar Solutions",
          value: "$42K",
          probability: 30,
          lastContact: "1 day ago",
        },
        {
          id: "3",
          name: "Emily Davis",
          company: "Renewable Corp",
          value: "$18K", 
          probability: 20,
          lastContact: "3 days ago",
        }
      ]
    },
    {
      title: "Contacted",
      count: 32,
      totalValue: "$421K",
      color: "bg-chart-4",
      leads: [
        {
          id: "4",
          name: "Robert Wilson",
          company: "Solar Dynamics",
          value: "$67K",
          probability: 50,
          lastContact: "1 hour ago",
        },
        {
          id: "5",
          name: "Lisa Martinez",
          company: "Clean Energy Co",
          value: "$35K",
          probability: 45,
          lastContact: "4 hours ago",
        }
      ]
    },
    {
      title: "Proposal Sent",
      count: 18,
      totalValue: "$567K",
      color: "bg-chart-1",
      leads: [
        {
          id: "6",
          name: "David Brown",
          company: "Future Solar",
          value: "$89K",
          probability: 75,
          lastContact: "30 min ago",
        },
        {
          id: "7",
          name: "Jennifer Lee",
          company: "Sustainable Systems",
          value: "$156K",
          probability: 80,
          lastContact: "2 hours ago",
        }
      ]
    },
    {
      title: "Closed Won",
      count: 24,
      totalValue: "$892K",
      color: "bg-chart-3",
      leads: [
        {
          id: "8",
          name: "Mark Thompson",
          company: "Energy Efficient Inc",
          value: "$125K",
          probability: 100,
          lastContact: "Closed today",
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sales Pipeline</h2>
        <Button data-testid="button-add-lead">Add New Lead</Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <PipelineStage key={stage.title} {...stage} />
        ))}
      </div>
    </div>
  );
}