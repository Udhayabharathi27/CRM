import RecentActivity from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Phone, Mail, MessageSquare, Calendar } from "lucide-react";

export default function Communications() {
  // TODO: remove mock data - replace with real data from API
  const communications = [
    {
      id: "1",
      type: "email",
      subject: "Solar Installation Proposal",
      preview: "Thank you for your interest in our solar solutions...",
      leadName: "Sarah Johnson",
      leadCompany: "GreenTech Industries",
      timestamp: "2 hours ago",
      status: "sent",
      avatar: "",
    },
    {
      id: "2", 
      type: "call",
      subject: "Follow-up Call",
      preview: "Discussed financing options and installation timeline...",
      leadName: "Robert Wilson",
      leadCompany: "Solar Dynamics", 
      timestamp: "4 hours ago",
      status: "completed",
      avatar: "",
    },
    {
      id: "3",
      type: "meeting",
      subject: "Site Assessment Meeting",
      preview: "Scheduled on-site visit for roof evaluation...",
      leadName: "Jennifer Lee",
      leadCompany: "Sustainable Systems",
      timestamp: "1 day ago",
      status: "scheduled",
      avatar: "",
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-chart-1 text-white';
      case 'completed': return 'bg-chart-3 text-white';
      case 'scheduled': return 'bg-chart-4 text-white';
      case 'pending': return 'bg-chart-2 text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-communications-title">
            Communications
          </h1>
          <p className="text-muted-foreground">
            Track all customer interactions and communications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            data-testid="button-compose-email"
          >
            <Mail className="h-4 w-4 mr-2" />
            Compose
          </Button>
          <Button 
            size="sm"
            data-testid="button-new-communication"
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search communications..."
            className="pl-9"
            data-testid="input-search-communications"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          data-testid="button-filter-communications"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" data-testid="tabs-communications">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-communications">
            All Communications
          </TabsTrigger>
          <TabsTrigger value="emails" data-testid="tab-emails">
            Emails
          </TabsTrigger>
          <TabsTrigger value="calls" data-testid="tab-calls">
            Calls
          </TabsTrigger>
          <TabsTrigger value="meetings" data-testid="tab-meetings">
            Meetings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {communications.map((comm) => (
                <Card key={comm.id} className="hover-elevate" data-testid={`card-communication-${comm.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {getTypeIcon(comm.type)}
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base" data-testid={`text-subject-${comm.id}`}>
                            {comm.subject}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {comm.preview}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(comm.status)} data-testid={`badge-status-${comm.id}`}>
                        {comm.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comm.avatar} />
                          <AvatarFallback className="text-xs">
                            {comm.leadName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{comm.leadName}</div>
                          <div className="text-xs text-muted-foreground">{comm.leadCompany}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{comm.timestamp}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emails">
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Communications</h3>
            <p className="text-muted-foreground mb-4">Filter by email communications only</p>
            <Button data-testid="button-compose-email-tab">Compose Email</Button>
          </div>
        </TabsContent>

        <TabsContent value="calls">
          <div className="text-center py-8">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Call History</h3>
            <p className="text-muted-foreground mb-4">View and manage call records</p>
            <Button data-testid="button-log-call">Log New Call</Button>
          </div>
        </TabsContent>

        <TabsContent value="meetings">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Meetings & Appointments</h3>
            <p className="text-muted-foreground mb-4">Schedule and track meetings</p>
            <Button data-testid="button-schedule-meeting">Schedule Meeting</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}