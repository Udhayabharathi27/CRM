import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { communicationsApi, leadsApi } from "@/lib/api";

// Sample users for assignment - using actual user IDs from database
const SAMPLE_USERS = [
  { id: '57aec392-41bc-44a8-ad61-8a7ed6afdf62', name: 'Admin User' },
  { id: '6d3e500b-0ec1-405e-9bc6-aec4aca51822', name: 'John Doe' },
  { id: '1d3e06fb-b1fe-40c1-b67d-a38f1becf695', name: 'Jane Smith' },
  { id: 'c177576b-322e-4610-83b0-95d34247c436', name: 'Mike Johnson' },
];

const COMMUNICATION_TYPES = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'meeting', label: 'Meeting', icon: Calendar },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'note', label: 'Note', icon: MessageSquare },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
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

  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy h:mm a');
  };

  const leadName = lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown Lead';
  const leadCompany = lead?.company || '';

  return (
    <Card className="hover-elevate border-2 border-border/80 shadow-md hover:shadow-lg transition-all duration-200 bg-card" data-testid={`card-communication-${communication.id}`}>
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
    onSuccess: async (createdCommunication: Communication) => {
      // If it's an SMS communication and not scheduled, send message via backend
      if (formData.type === 'sms' && !formData.scheduledAt) {
        try {
          // Get lead details for phone number
          const lead = await leadsApi.get(createdCommunication.leadId);
          if (lead?.phone) {
            // Format phone number
            let formattedPhone = lead.phone.replace(/\D/g, '');
            if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
              formattedPhone = '91' + formattedPhone;
            }
            
            console.log('📱 Sending SMS via backend...');
            
            // Call your backend SMS API endpoint
            const response = await fetch('/api/sms/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                communicationId: createdCommunication.id,
                leadId: createdCommunication.leadId,
                to: formattedPhone,
                body: createdCommunication.content
              }),
            });
            
            const result = await response.json();
            console.log('📱 SMS API response via backend:', result);
            
            if (result.success) {
              console.log('✅ SMS sent successfully! Message ID:', result.messageId);
            } else {
              console.warn('⚠️ SMS may not have been sent:', result.error);
              // Show warning toast but don't block the success flow
              toast({
                title: "Warning",
                description: "Communication created but SMS may not have been sent",
                variant: "default",
              });
            }
          }
        } catch (error) {
          console.error('❌ Failed to send SMS via backend:', error);
          // Show warning but don't block the success flow
          toast({
            title: "Warning",
            description: "Communication created but SMS failed to send",
            variant: "default",
          });
        }
      }
      
      // If it's a WhatsApp communication and not scheduled, send message via backend
      if (formData.type === 'whatsapp' && !formData.scheduledAt) {
        try {
          // Get lead details for phone number
          const lead = await leadsApi.get(createdCommunication.leadId);
          if (lead?.phone) {
            // Format phone number
            let formattedPhone = lead.phone.replace(/\D/g, '');
            if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
              formattedPhone = '91' + formattedPhone;
            }
            
            console.log('📱 Sending WhatsApp message via backend...');
            
            // Call your backend WhatsApp API endpoint
            const response = await fetch('/api/whatsapp/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                communicationId: createdCommunication.id,
                leadId: createdCommunication.leadId,
                to: formattedPhone,
                message: createdCommunication.content
              }),
            });
            
            const result = await response.json();
            console.log('📱 WhatsApp API response via backend:', result);
            
            if (result.success) {
              console.log('✅ WhatsApp message sent successfully! Message ID:', result.whatsappMessageId);
            } else {
              console.warn('⚠️ WhatsApp message may not have been sent:', result.error);
              // Show warning toast but don't block the success flow
              toast({
                title: "Warning",
                description: "Communication created but WhatsApp message may not have been sent",
                variant: "default",
              });
            }
          }
        } catch (error) {
          console.error('❌ Failed to send WhatsApp message via backend:', error);
          // Show warning but don't block the success flow
          toast({
            title: "Warning",
            description: "Communication created but WhatsApp message failed to send",
            variant: "default",
          });
        }
      }

      // If it's an Email communication and not scheduled, send email via backend
      if (formData.type === 'email' && !formData.scheduledAt) {
        try {
          // Get lead details for email
          const lead = await leadsApi.get(createdCommunication.leadId);
          if (lead?.email) {
            console.log('📧 Sending Email via backend...');
            
            // Call your backend Email API endpoint
            const response = await fetch('/api/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                communicationId: createdCommunication.id,
                leadId: createdCommunication.leadId,
                to: lead.email,
                subject: createdCommunication.subject || 'Communication from Solar CRM',
                text: createdCommunication.content,
                html: `<p>${createdCommunication.content}</p>`
              }),
            });
            
            const result = await response.json();
            console.log('📧 Email API response via backend:', result);
            
            if (result.success) {
              console.log('✅ Email sent successfully!');
            } else {
              console.warn('⚠️ Email may not have been sent:', result.error);
              // Show warning toast but don't block the success flow
              toast({
                title: "Warning",
                description: "Communication created but email may not have been sent",
                variant: "default",
              });
            }
          }
        } catch (error) {
          console.error('❌ Failed to send email via backend:', error);
          // Show warning but don't block the success flow
          toast({
            title: "Warning",
            description: "Communication created but email failed to send",
            variant: "default",
          });
        }
      }

      // If it's a Call communication and not scheduled, initiate call via backend
      if (formData.type === 'call' && !formData.scheduledAt) {
        try {
          // Get lead details for phone number
          const lead = await leadsApi.get(createdCommunication.leadId);
          if (lead?.phone) {
            console.log('📞 Initiating Voice Call via backend...');
            
            // Call your backend Voice Call API endpoint
            const response = await fetch('/api/calls/make-call', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                communicationId: createdCommunication.id,
                leadId: createdCommunication.leadId,
                to: lead.phone
              }),
            });
            
            const result = await response.json();
            console.log('📞 Voice Call API response via backend:', result);
            
            if (result.success) {
              console.log('✅ Voice call initiated successfully! Call SID:', result.callSid);
            } else {
              console.warn('⚠️ Voice call may not have been initiated:', result.error);
              // Show warning toast but don't block the success flow
              toast({
                title: "Warning",
                description: "Communication created but voice call may not have been initiated",
                variant: "default",
              });
            }
          }
        } catch (error) {
          console.error('❌ Failed to initiate voice call via backend:', error);
          // Show warning but don't block the success flow
          toast({
            title: "Warning",
            description: "Communication created but voice call failed to initiate",
            variant: "default",
          });
        }
      }
      
      // Invalidate queries and show success message
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
    
    // For email type, ensure subject is provided
    if (formData.type === 'email' && !formData.subject.trim()) {
      toast({
        title: "Error",
        description: "Subject is required for email communications",
        variant: "destructive",
      });
      return;
    }

    // For all types, ensure content is provided
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      });
      return;
    }

    // Ensure lead is selected
    if (!formData.leadId) {
      toast({
        title: "Error",
        description: "Please select a lead",
        variant: "destructive",
      });
      return;
    }

    const communicationData = {
      leadId: formData.leadId,
      userId: formData.userId,
      type: formData.type,
      subject: formData.subject || null,
      content: formData.content,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
    };

    console.log('🔵 Submitting communication data:', communicationData);
    
    mutation.mutate(communicationData);
  };

  const selectedLead = leads.find(lead => lead.id === formData.leadId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {communication ? 'Edit Communication' : 'New Communication'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Assignment Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">1</span>
                </div>
                Assignment
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Associate with lead and assign team member</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadId" className="text-sm font-medium text-foreground">Lead *</Label>
                <Select 
                  value={formData.leadId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: value }))}
                  required
                >
                  <SelectTrigger data-testid="select-lead" className="border-border/60 focus:border-primary/60">
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
                {selectedLead && (
                  <div className="text-xs text-muted-foreground">
                    {formData.type === 'email' && `Email: ${selectedLead.email}`}
                    {(formData.type === 'sms' || formData.type === 'whatsapp' || formData.type === 'call') && `Phone: ${selectedLead.phone}`}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-medium text-foreground">Assigned To *</Label>
                <Select 
                  value={formData.userId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
                  required
                >
                  <SelectTrigger data-testid="select-user" className="border-border/60 focus:border-primary/60">
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
          </div>

          {/* Communication Details Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">2</span>
                </div>
                Communication Details
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Type, timing, and content information</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-foreground">Communication Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Communication['type'] }))}
                  required
                >
                  <SelectTrigger data-testid="select-type" className="border-border/60 focus:border-primary/60">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMUNICATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt" className="text-sm font-medium text-foreground">Schedule Date & Time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  data-testid="input-scheduled-at"
                  className="border-border/60 focus:border-primary/60"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.scheduledAt ? 'Will be sent automatically at scheduled time' : 'Will be sent immediately'}
                </p>
              </div>
            </div>

            {formData.type === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">Email Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject..."
                  required={formData.type === 'email'}
                  data-testid="input-subject"
                  className="border-border/60 focus:border-primary/60"
                />
              </div>
            )}

            {formData.type !== 'email' && (
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Communication subject (optional)..."
                  data-testid="input-subject"
                  className="border-border/60 focus:border-primary/60"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-foreground">
                {formData.type === 'email' ? 'Email Content *' : 
                 formData.type === 'call' ? 'Call Notes *' : 'Content *'}
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={
                  formData.type === 'email' ? 'Write your email content here...' :
                  formData.type === 'sms' ? 'Write your SMS message here...' :
                  formData.type === 'whatsapp' ? 'Write your WhatsApp message here...' :
                  formData.type === 'call' ? 'Add notes about the call purpose or discussion points...' :
                  'Communication details...'
                }
                rows={5}
                required
                data-testid="input-content"
                className="border-border/60 focus:border-primary/60 min-h-[120px] resize-none"
              />
              <div className="text-xs text-muted-foreground">
                {formData.type === 'sms' && 'SMS messages are limited to 160 characters.'}
                {formData.type === 'whatsapp' && 'WhatsApp supports longer messages and media.'}
                {formData.type === 'email' && 'Email content will be sent as both text and HTML.'}
                {formData.type === 'call' && 'Call notes will help you remember discussion points.'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {communication ? 'Created: ' + format(new Date(communication.createdAt), 'MMM d, yyyy') : 'All required fields must be completed'}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="min-w-20">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending} 
                data-testid="button-save-communication" 
                className="min-w-32 button-enhance"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner-professional"></div>
                    Saving...
                  </div>
                ) : formData.scheduledAt ? (
                  'Schedule Communication'
                ) : (
                  (communication ? 'Update' : 'Create') + ' Communication'
                )}
              </Button>
            </div>
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
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-professional mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight" data-testid="text-communications-title">
            Communications
          </h1>
          <p className="text-muted-foreground text-lg">
            Track all customer interactions across Email, SMS, WhatsApp, Calls and more
          </p>
        </div>
        <Button onClick={handleNewCommunication} data-testid="button-new-communication" className="button-enhance ripple" size="default">
          <Plus className="h-4 w-4 mr-2 state-transition" />
          New Communication
        </Button>
      </div>

      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Communication Controls</h3>
          <p className="text-sm text-muted-foreground">Search and filter communications</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search communications by subject, content..."
              className="pl-9 border-border/60 focus:border-primary/60 field-enhance"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-communications"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] border-border/60 focus:border-primary/60" data-testid="select-type-filter">
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
            <SelectTrigger className="w-[200px] border-border/60 focus:border-primary/60" data-testid="select-lead-filter">
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
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
        }}
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