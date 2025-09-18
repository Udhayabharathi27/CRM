import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-chart-3' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  
  return (
    <Card data-testid={`card-stats-${title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-value-${title.toLowerCase().replace(' ', '-')}`}>
          {value}
        </div>
        <p className={`text-xs ${trendColor} flex items-center gap-1`} data-testid={`text-change-${title.toLowerCase().replace(' ', '-')}`}>
          <TrendingUp className="h-3 w-3" />
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  // TODO: remove mock data - replace with real data from API
  const stats = [
    {
      title: "Total Leads",
      value: "2,847",
      change: "+12% from last month",
      icon: <Users className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: "Pipeline Value",
      value: "$1.2M",
      change: "+8% from last month", 
      icon: <DollarSign className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: "Conversion Rate",
      value: "18.5%",
      change: "+2.1% from last month",
      icon: <Target className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: "Closed Deals",
      value: "127",
      change: "+23% from last month",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}