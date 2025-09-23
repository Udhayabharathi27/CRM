import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import Pipeline from "@/pages/Pipeline";
import Campaigns from "@/pages/Campaigns";
import Communications from "@/pages/Communications";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/pipeline" component={Pipeline} />
      <Route path="/leads" component={Pipeline} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/communications" component={Communications} />
      <Route path="/analytics" component={Dashboard} />
      <Route path="/calendar" component={Communications} />
      <Route path="/reports" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md supports-[backdrop-filter]:bg-card/30 shadow-sm">
                <div className="flex items-center gap-4">
                  <SidebarTrigger 
                    data-testid="button-sidebar-toggle" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="h-4 w-4 rounded bg-primary"></div>
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold text-foreground">Solar CRM</h1>
                      <p className="text-xs text-muted-foreground">Professional Pipeline Management</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-auto bg-muted/30">
                <div className="container mx-auto p-6 max-w-7xl">
                  <Router />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}