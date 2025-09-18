import {
  BarChart3,
  Users,
  Target,
  MessageSquare,
  Settings,
  Mail,
  Phone,
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

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Pipeline",
    url: "/pipeline",
    icon: Target,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Mail,
  },
  {
    title: "Communications",
    url: "/communications",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
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

export function AppSidebar() {
  const [location] = useLocation();

  const handleQuickAction = (action: string) => {
    console.log(`${action} triggered`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">SolarCRM</h2>
            <p className="text-xs text-muted-foreground">Pipeline Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={isActive ? "bg-sidebar-accent" : ""}
                      data-testid={`link-${item.title.toLowerCase()}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton 
                    onClick={() => handleQuickAction(action.action)}
                    data-testid={`button-${action.title.toLowerCase()}`}
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">John Doe</div>
            <div className="text-xs text-muted-foreground">Sales Manager</div>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
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