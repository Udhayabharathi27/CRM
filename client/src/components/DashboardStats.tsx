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
    <Card data-testid={`card-stats-${title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-value-${title.toLowerCase().replace(' ', '-')}`}>
          {isLoading ? '...' : value}
        </div>
        <p className={`text-xs ${trendColor} flex items-center gap-1`} data-testid={`text-change-${title.toLowerCase().replace(' ', '-')}`}>
          <TrendingUp className="h-3 w-3" />
          {isLoading ? 'Loading...' : change}
        </p>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <StatsCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}