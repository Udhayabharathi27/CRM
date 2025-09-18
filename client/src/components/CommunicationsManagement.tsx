import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationsApi, leadsApi } from "@/lib/api";
import type { Communication, InsertCommunication, Lead } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Plus, Phone, Mail, MessageSquare, Calendar, MoreHorizontal, Edit, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

// Sample users for assignment - using actual user IDs from database
const SAMPLE_USERS = [
  { id: '57aec392-41bc-44a8-ad61-8a7ed6afdf62', name: 'John Doe' },
  { id: '6d3e500b-0ec1-405e-9bc6-aec4aca51822', name: 'Jane Smith' },
  { id: '1d3e06fb-b1fe-40c1-b67d-a38f1becf695', name: 'Mike Johnson' },
  { id: 'c177576b-322e-4610-83b0-95d34247c436', name: 'Admin User' },
];

const COMMUNICATION_TYPES = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'meeting', label: 'Meeting', icon: Calendar },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'note', label: 'Note', icon: MessageSquare },
];

interface CommunicationCardProps {
  communication: Communication;
  lead?: Lead;
  onEdit: (communication: Communication) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

function CommunicationCard({ communication, lead, onEdit, onDelete, onComplete }: CommunicationCardProps) {
  const getTypeIcon = (type: string) => {
    const typeConfig = COMMUNICATION_TYPES.find(t => t.value === type);
    const IconComponent = typeConfig?.icon || MessageSquare;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusColor = (communication: Communication) => {
    if (communication.completedAt) return 'bg-chart-3 text-white';
    if (communication.scheduledAt && new Date(communication.scheduledAt) > new Date()) return 'bg-chart-4 text-white';
    if (communication.scheduledAt && new Date(communication.scheduledAt) <= new Date()) return 'bg-chart-2 text-black';
    return 'bg-chart-1 text-white';
  };

  const getStatusText = (communication: Communication) => {
    if (communication.completedAt) return 'Completed';
    if (communication.scheduledAt && new Date(communication.scheduledAt) > new Date()) return 'Scheduled';
    if (communication.scheduledAt && new Date(communication.scheduledAt) <= new Date()) return 'Overdue';
    return 'Draft';
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  const leadName = lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown Lead';
  const leadCompany = lead?.company || '';

  return (
    <Card className="hover-elevate" data-testid={`card-communication-${communication.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {getTypeIcon(communication.type)}
            </div>
            <div className="space-y-1 flex-1">
              <CardTitle className="text-base" data-testid={`text-subject-${communication.id}`}>
                {communication.subject || `${COMMUNICATION_TYPES.find(t => t.value === communication.type)?.label} Communication`}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {communication.content}
              </p>
              {communication.scheduledAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Scheduled: {formatDate(communication.scheduledAt)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(communication)} data-testid={`badge-status-${communication.id}`}>
              {getStatusText(communication)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid={`button-menu-${communication.id}`}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(communication)} data-testid={`button-edit-${communication.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {!communication.completedAt && (
                  <DropdownMenuItem onClick={() => onComplete(communication.id)} data-testid={`button-complete-${communication.id}`}>
                    <Clock className="h-4 w-4 mr-2" />
                    Mark Complete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(communication.id)} 
                  className="text-destructive"
                  data-testid={`button-delete-${communication.id}`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {leadName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{leadName}</div>
              {leadCompany && <div className="text-xs text-muted-foreground">{leadCompany}</div>}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {communication.completedAt ? formatDate(communication.completedAt) : formatDate(communication.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CommunicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  communication?: Communication;
  onSuccess: () => void;
}

function CommunicationDialog({ isOpen, onOpenChange, communication, onSuccess }: CommunicationDialogProps) {
  const [formData, setFormData] = useState({
    leadId: communication?.leadId || '',
    userId: communication?.userId || SAMPLE_USERS[0].id,
    type: communication?.type || 'email',
    subject: communication?.subject || '',
    content: communication?.content || '',
    scheduledAt: communication?.scheduledAt ? new Date(communication.scheduledAt).toISOString().slice(0, 16) : '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: () => leadsApi.getAll(),
  });

  const mutation = useMutation({
    mutationFn: (data: InsertCommunication) => {
      if (communication) {
        return communicationsApi.update(communication.id, data);
      } else {
        return communicationsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      toast({
        title: "Success",
        description: `Communication ${communication ? 'updated' : 'created'} successfully`,
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{communication ? 'Edit Communication' : 'New Communication'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadId">Lead</Label>
              <Select value={formData.leadId} onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: value }))}>
                <SelectTrigger data-testid="select-lead">
                  <SelectValue placeholder="Select lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.firstName} {lead.lastName} - {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="userId">Assigned To</Label>
              <Select value={formData.userId} onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}>
                <SelectTrigger data-testid="select-user">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_USERS.map((user) => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Communication Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                data-testid="input-scheduled-at"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Communication subject..."
              data-testid="input-subject"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Communication details..."
              rows={4}
              required
              data-testid="input-content"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-communication">
              {mutation.isPending ? 'Saving...' : (communication ? 'Update' : 'Create')} Communication
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CommunicationsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommunication, setEditingCommunication] = useState<Communication | undefined>();
  const [deleteCommunicationId, setDeleteCommunicationId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['/api/communications', { leadId: selectedLead, type: typeFilter }],
    queryFn: () => communicationsApi.getAll(selectedLead === 'all' ? undefined : selectedLead || undefined),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: () => leadsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => communicationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      toast({
        title: "Success",
        description: "Communication deleted successfully",
      });
      setDeleteCommunicationId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => communicationsApi.update(id, { completedAt: new Date() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      toast({
        title: "Success",
        description: "Communication marked as completed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = !searchTerm || 
      comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEdit = (communication: Communication) => {
    setEditingCommunication(communication);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteCommunicationId(id);
  };

  const confirmDelete = () => {
    if (deleteCommunicationId) {
      deleteMutation.mutate(deleteCommunicationId);
    }
  };

  const handleComplete = (id: string) => {
    completeMutation.mutate(id);
  };

  const handleNewCommunication = () => {
    setEditingCommunication(undefined);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading communications...</div>;
  }

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
        <Button onClick={handleNewCommunication} data-testid="button-new-communication">
          <Plus className="h-4 w-4 mr-2" />
          New Communication
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search communications..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-communications"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {COMMUNICATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLead} onValueChange={setSelectedLead}>
          <SelectTrigger className="w-[200px]" data-testid="select-lead-filter">
            <SelectValue placeholder="Filter by lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.firstName} {lead.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredCommunications.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Communications Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== 'all' || selectedLead ? 'Try adjusting your filters' : 'Start tracking customer interactions'}
            </p>
            <Button onClick={handleNewCommunication}>Create First Communication</Button>
          </div>
        ) : (
          filteredCommunications.map((communication) => {
            const lead = leads.find(l => l.id === communication.leadId);
            return (
              <CommunicationCard
                key={communication.id}
                communication={communication}
                lead={lead}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            );
          })
        )}
      </div>

      <CommunicationDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingCommunication(undefined);
        }}
        communication={editingCommunication}
        onSuccess={() => {}}
      />

      <AlertDialog open={deleteCommunicationId !== null} onOpenChange={() => setDeleteCommunicationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Communication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this communication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Communication
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}