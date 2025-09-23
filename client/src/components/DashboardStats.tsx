import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

function StatsCard({ title, value, change, icon, trend, isLoading }: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-chart-3' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  
  return (
    <Card className="hover-elevate group border-border/60 shadow-sm transition-all duration-200" data-testid={`card-stats-${title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">{title}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-foreground tracking-tight" data-testid={`text-value-${title.toLowerCase().replace(' ', '-')}`}>
          {isLoading ? (
            <div className="animate-pulse bg-muted rounded h-8 w-24"></div>
          ) : (
            value
          )}
        </div>
        <div className={`text-sm ${trendColor} flex items-center gap-2 font-medium`} data-testid={`text-change-${title.toLowerCase().replace(' ', '-')}`}>
          <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
            trend === 'up' ? 'bg-chart-3/20' : trend === 'down' ? 'bg-destructive/20' : 'bg-muted-foreground/20'
          }`}>
            <TrendingUp className="h-3 w-3" />
          </div>
          {isLoading ? (
            <div className="animate-pulse bg-muted rounded h-4 w-32"></div>
          ) : (
            change
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  if (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }

  const statsCards = [
    {
      title: "Total Leads",
      value: stats ? stats.totalLeads.toLocaleString() : "0",
      change: "+12% from last month",
      icon: <Users className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: "Pipeline Value",
      value: stats ? stats.pipelineValue : "$0",
      change: "+8% from last month", 
      icon: <DollarSign className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: "Conversion Rate",
      value: stats ? stats.conversionRate : "0%",
      change: "+2.1% from last month",
      icon: <Target className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: "Closed Deals",
      value: stats ? stats.closedDeals.toString() : "0",
      change: "+23% from last month",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const,
    },
  ];

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <StatsCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}