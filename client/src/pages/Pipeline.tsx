import LeadsPipeline from "@/components/LeadsPipeline";
import DashboardStats from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Download } from "lucide-react";

export default function Pipeline() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-pipeline-title">
            Sales Pipeline
          </h1>
          <p className="text-muted-foreground">
            Manage your leads through each stage of the sales process
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            data-testid="button-export-pipeline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            size="sm"
            data-testid="button-add-lead"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            data-testid="input-search-leads"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          data-testid="button-filter-leads"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <LeadsPipeline />
    </div>
  );
}