import LeadsPipeline from "@/components/LeadsPipeline";
import DashboardStats from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Download } from "lucide-react";

export default function Pipeline() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight" data-testid="text-pipeline-title">
            Sales Pipeline
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your leads through each stage of the sales process
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="default"
            data-testid="button-export-pipeline"
            className="button-enhance ripple"
          >
            <Download className="h-4 w-4 mr-2 state-transition" />
            Export Pipeline
          </Button>
          <Button 
            size="default"
            data-testid="button-add-lead"
            className="button-enhance ripple"
          >
            <Plus className="h-4 w-4 mr-2 state-transition" />
            Add New Lead
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pipeline Controls</h3>
          <p className="text-sm text-muted-foreground">Search and filter your leads</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, company, email..."
              className="pl-9 border-border/60 focus:border-primary/60 field-enhance"
              data-testid="input-search-leads"
            />
          </div>
          <Button 
            variant="outline" 
            size="default"
            data-testid="button-filter-leads"
            className="button-enhance min-w-28"
          >
            <Filter className="h-4 w-4 mr-2 state-transition" />
            Advanced Filters
          </Button>
        </div>
      </div>

      <LeadsPipeline />
    </div>
  );
}