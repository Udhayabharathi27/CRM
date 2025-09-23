import {
  BarChart3,
  Users,
  Target,
  MessageSquare,
  Settings,
  Mail,
  Calendar,
  FileText,
  Home,
  Search,
  Bell
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "Overview & metrics"
  },
  {
    title: "Pipeline",
    url: "/pipeline",
    icon: Target,
    description: "Sales opportunities"
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
    description: "Lead management"
  }
];

const communicationItems = [
  {
    title: "Communications",
    url: "/communications",
    icon: MessageSquare,
    description: "Message history"
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Mail,
    description: "Marketing campaigns"
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Schedule & events"
  }
];

const analyticsItems = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    description: "Performance insights"
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    description: "Custom reports"
  }
];

const quickActions = [
  {
    title: "Search",
    icon: Search,
    action: "search",
  },
  {
    title: "Notifications",
    icon: Bell,
    action: "notifications",
  }
];

const MenuSection = ({ title, items }: { title: string; items: typeof mainMenuItems }) => {
  const [location] = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 py-2">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent className="px-2">
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = location === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={`
                    h-12 px-3 hover-elevate rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : ""
                    }
                  `}
                  data-testid={`link-${item.title.toLowerCase()}`}
                >
                  <Link href={item.url} className="flex items-center gap-3 w-full">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-md
                      ${isActive 
                        ? "bg-primary-foreground/20" 
                        : "bg-sidebar-accent/30"
                      }
                    `}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm">{item.title}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export function AppSidebar() {
  const handleQuickAction = (action: string) => {
    console.log(`${action} triggered`);
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6 border-b border-border/50 bg-card/30">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">SolarCRM</h2>
            <p className="text-xs text-muted-foreground font-medium">Enterprise Pipeline Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <MenuSection title="Main" items={mainMenuItems} />
        <MenuSection title="Communication" items={communicationItems} />
        <MenuSection title="Analytics" items={analyticsItems} />
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 py-2">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton 
                    onClick={() => handleQuickAction(action.action)}
                    className="h-10 px-3 hover-elevate rounded-lg transition-all duration-200"
                    data-testid={`button-${action.title.toLowerCase()}`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent/30">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{action.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 bg-card/30">
        <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate transition-all duration-200">
          <Avatar className="h-10 w-10 border-2 border-border/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">John Doe</div>
            <div className="text-xs text-muted-foreground">Sales Manager</div>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            data-testid="button-settings"
            onClick={() => console.log('Settings triggered')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}