import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationsApi } from "@/lib/api";
import type { Communication, InsertCommunication } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MessageSquare, Calendar, Plus, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

// Sample users for assignment - using actual user IDs from database
// Replace the hardcoded IDs with actual user IDs from your database
// Replace the entire SAMPLE_USERS array with this:
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
];

interface CommunicationHistoryProps {
  leadId: string;
  leadName: string;
}

interface QuickCommunicationDialogProps {
  leadId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function QuickCommunicationDialog({ leadId, isOpen, onOpenChange, onSuccess }: QuickCommunicationDialogProps) {
  const [formData, setFormData] = useState({
    type: 'note',
    subject: '',
    content: '',
    scheduledAt: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: InsertCommunication) => communicationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      toast({
        title: "Success",
        description: "Communication logged successfully",
      });
      onOpenChange(false);
      onSuccess();
      setFormData({ type: 'note', subject: '', content: '', scheduledAt: '' });
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
  
  const communicationData = {
    leadId,
    userId: SAMPLE_USERS[0]?.id || null, // Use null if no user available
    type: formData.type,
    subject: formData.subject || null,
    content: formData.content,
    scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
  };

  console.log('🔵 Submitting communication data:', communicationData);
  
  mutation.mutate(communicationData);
};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Communication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger data-testid="select-quick-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMUNICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Communication subject..."
              data-testid="input-quick-subject"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Communication details..."
              rows={3}
              required
              data-testid="input-quick-content"
            />
          </div>

          <div>
            <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              data-testid="input-quick-scheduled"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-quick-communication">
              {mutation.isPending ? 'Saving...' : 'Log Communication'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CommunicationHistory({ leadId, leadName }: CommunicationHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['/api/communications', { leadId }],
    queryFn: () => communicationsApi.getAll(leadId),
  });

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
    return format(new Date(date), 'MMM d, h:mm a');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading communications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Communication History</CardTitle>
          <Button size="sm" onClick={() => setIsDialogOpen(true)} data-testid="button-add-communication">
            <Plus className="h-4 w-4 mr-1" />
            Log
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No communications yet</p>
            <Button size="sm" onClick={() => setIsDialogOpen(true)} data-testid="button-first-communication">
              Log First Communication
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {communications.map((communication) => (
              <div
                key={communication.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                data-testid={`communication-item-${communication.id}`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                  {getTypeIcon(communication.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="font-medium text-sm truncate">
                      {communication.subject || `${COMMUNICATION_TYPES.find(t => t.value === communication.type)?.label} Communication`}
                    </div>
                    <Badge size="sm" className={getStatusColor(communication)}>
                      {getStatusText(communication)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {communication.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {communication.completedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {formatDate(communication.completedAt)}
                      </div>
                    )}
                    {communication.scheduledAt && !communication.completedAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(communication.scheduledAt)}
                      </div>
                    )}
                    {!communication.scheduledAt && !communication.completedAt && (
                      <div>{formatDate(communication.createdAt)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <QuickCommunicationDialog
        leadId={leadId}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {}}
      />
    </Card>
  );
}