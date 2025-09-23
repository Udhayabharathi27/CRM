import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import CommunicationHistory from "@/components/CommunicationHistory";
import { DollarSign, Phone, Mail, Calendar, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api";
import type { Lead, InsertLead } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LeadCardProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: Lead['status']) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

function LeadCard({ lead, onStatusUpdate, onEdit, onDelete }: LeadCardProps) {
  const formatCurrency = (value: string | null) => {
    if (!value) return '$0';
    return `$${Number(value).toLocaleString()}`;
  };

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-chart-2 text-black';
      case 'contacted': return 'bg-chart-4 text-white';
      case 'proposal': return 'bg-chart-1 text-white';
      case 'closed_won': return 'bg-chart-3 text-white';
      case 'closed_lost': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New';
      case 'contacted': return 'Contacted';
      case 'proposal': return 'Proposal';
      case 'closed_won': return 'Closed Won';
      case 'closed_lost': return 'Closed Lost';
      default: return status;
    }
  };

  return (
    <Card className="mb-3 hover-elevate border-2 border-border/80 shadow-md hover:shadow-lg transition-all duration-200 group bg-card" data-testid={`card-lead-${lead.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>{getInitials(lead.firstName, lead.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm" data-testid={`text-lead-name-${lead.id}`}>
                {lead.firstName} {lead.lastName}
              </div>
              <div className="text-xs text-muted-foreground">{lead.company}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={lead.status} onValueChange={(value) => onStatusUpdate(lead.id, value as Lead['status'])}>
              <SelectTrigger className="h-6 text-xs border-0 p-0">
                <Badge className={getStatusColor(lead.status)} data-testid={`badge-status-${lead.id}`}>
                  {getStatusLabel(lead.status)}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(lead)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(lead.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-1 text-chart-1">
            <DollarSign className="h-3 w-3" />
            <span data-testid={`text-lead-value-${lead.id}`}>{formatCurrency(lead.estimatedValue)}</span>
          </div>
          <div className="text-xs text-muted-foreground">{lead.probability}%</div>
        </div>

        <div className="text-xs text-muted-foreground mb-3 space-y-1">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{lead.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatDate(lead.updatedAt)}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
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

interface PipelineStageProps {
  title: string;
  status: string;
  leads: Lead[];
  color: string;
  onStatusUpdate: (leadId: string, newStatus: Lead['status']) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

function PipelineStage({ title, status, leads, color, onStatusUpdate, onEdit, onDelete }: PipelineStageProps) {
  const totalValue = leads.reduce((sum, lead) => sum + Number(lead.estimatedValue || 0), 0);
  
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
              {leads.length}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground" data-testid={`text-total-value-${title.toLowerCase().replace(' ', '-')}`}>
            Total: ${(totalValue / 1000).toFixed(0)}K
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {leads.map((lead) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onStatusUpdate={onStatusUpdate}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface LeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  onSuccess: () => void;
}

// Sample users for assignment - using actual user IDs from database
const SAMPLE_USERS = [
  { id: '57aec392-41bc-44a8-ad61-8a7ed6afdf62', name: 'John Doe' },
  { id: '6d3e500b-0ec1-405e-9bc6-aec4aca51822', name: 'Jane Smith' },
  { id: '1d3e06fb-b1fe-40c1-b67d-a38f1becf695', name: 'Mike Johnson' },
  { id: 'c177576b-322e-4610-83b0-95d34247c436', name: 'Admin User' },
];

function LeadDialog({ isOpen, onOpenChange, lead, onSuccess }: LeadDialogProps) {
  const [formData, setFormData] = useState({
    firstName: lead?.firstName || '',
    lastName: lead?.lastName || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    address: lead?.address || '',
    city: lead?.city || '',
    state: lead?.state || '',
    zipCode: lead?.zipCode || '',
    estimatedValue: lead?.estimatedValue || '',
    assignedTo: lead?.assignedTo || 'unassigned',
    probability: lead?.probability?.toString() || '25',
    notes: lead?.notes || '',
    source: lead?.source || 'manual',
    status: lead?.status || 'new',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: InsertLead) => {
      if (lead) {
        return leadsApi.update(lead.id, data);
      } else {
        return leadsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      onOpenChange(false);
      onSuccess();
      toast({
        title: "Success",
        description: lead ? "Lead updated successfully" : "Lead created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${lead ? 'update' : 'create'} lead`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      probability: parseInt(formData.probability) || 25,
      estimatedValue: formData.estimatedValue === '' ? null : formData.estimatedValue,
      assignedTo: formData.assignedTo === 'unassigned' ? null : formData.assignedTo,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">1</span>
                </div>
                Contact Information
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Basic contact details for the lead</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  data-testid="input-first-name"
                  className="border-border/60 focus:border-primary/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  data-testid="input-last-name"
                  className="border-border/60 focus:border-primary/60"
                />
              </div>
            </div>
          
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="input-phone"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">2</span>
                </div>
                Company Information
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Business details and address</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-foreground">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                data-testid="input-company"
                className="border-border/60 focus:border-primary/60"
                placeholder="Acme Solar Solutions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-foreground">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                data-testid="input-address"
                className="border-border/60 focus:border-primary/60"
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-foreground">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  data-testid="input-city"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="Austin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-foreground">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  data-testid="input-state"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="TX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium text-foreground">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  data-testid="input-zip-code"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="78701"
                />
              </div>
            </div>
          </div>

          {/* Lead Details Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">3</span>
                </div>
                Lead Details
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Sales opportunity information</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue" className="text-sm font-medium text-foreground">Estimated Value ($)</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                  data-testid="input-estimated-value"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="25000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability" className="text-sm font-medium text-foreground">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  data-testid="input-probability"
                  className="border-border/60 focus:border-primary/60"
                  placeholder="25"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-sm font-medium text-foreground">Assigned To</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                  <SelectTrigger data-testid="select-assigned-to" className="border-border/60 focus:border-primary/60">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {SAMPLE_USERS.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-foreground">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Lead['status'] }))}>
                  <SelectTrigger data-testid="select-status" className="border-border/60 focus:border-primary/60">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                data-testid="input-notes"
                placeholder="Add any relevant notes about this lead..."
                className="border-border/60 focus:border-primary/60 min-h-[100px] resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {lead ? 'Last updated: ' + new Date(lead.updatedAt || lead.createdAt).toLocaleDateString() : 'All required fields must be completed'}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="min-w-20">
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid="button-save-lead" className="min-w-32">
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  lead ? 'Update Lead' : 'Create Lead'
                )}
              </Button>
            </div>
          </div>
        </form>

        {lead && (
          <div className="border-t pt-6">
            <CommunicationHistory 
              leadId={lead.id} 
              leadName={`${lead.firstName} ${lead.lastName}`}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['/api/leads', { search: searchTerm, status: statusFilter }],
    queryFn: () => leadsApi.getAll({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter || undefined,
    }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: Lead['status'] }) => 
      leadsApi.update(leadId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      toast({
        title: "Success",
        description: "Lead status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: leadsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete lead",
        variant: "destructive",
      });
    },
  });

  if (error) {
    console.error('Failed to fetch leads:', error);
  }

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    updateStatusMutation.mutate({ leadId, status: newStatus });
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsDialogOpen(true);
  };

  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);

  const handleDelete = (leadId: string) => {
    setDeleteLeadId(leadId);
  };

  const confirmDelete = () => {
    if (deleteLeadId) {
      deleteMutation.mutate(deleteLeadId);
      setDeleteLeadId(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingLead(undefined);
  };

  // Group leads by status
  const leadsByStatus = {
    new: leads.filter(lead => lead.status === 'new'),
    contacted: leads.filter(lead => lead.status === 'contacted'), 
    proposal: leads.filter(lead => lead.status === 'proposal'),
    closed_won: leads.filter(lead => lead.status === 'closed_won'),
  };

  const pipelineStages = [
    {
      title: "New Leads",
      status: "new",
      color: "bg-chart-2",
      leads: leadsByStatus.new,
    },
    {
      title: "Contacted",
      status: "contacted",
      color: "bg-chart-4", 
      leads: leadsByStatus.contacted,
    },
    {
      title: "Proposal Sent",
      status: "proposal",
      color: "bg-chart-1",
      leads: leadsByStatus.proposal,
    },
    {
      title: "Closed Won",
      status: "closed_won",
      color: "bg-chart-3",
      leads: leadsByStatus.closed_won,
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lead Management</h2>
          <Button disabled>Add New Lead</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 min-w-[280px]">
              <Card className="h-[400px] animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lead Management</h2>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-lead">
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-leads"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
            <SelectItem value="closed_lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <PipelineStage 
            key={stage.title} 
            {...stage} 
            onStatusUpdate={handleStatusUpdate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <LeadDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        lead={editingLead}
        onSuccess={() => {}}
      />

      <AlertDialog open={deleteLeadId !== null} onOpenChange={() => setDeleteLeadId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}