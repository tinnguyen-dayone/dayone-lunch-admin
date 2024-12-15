import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              "text-xs",
              change.trend === "up" ? "text-green-600" : "text-red-600"
            )}
          >
            {change.trend === "up" ? "+" : "-"}
            {Math.abs(change.value)}%
            <span className="text-muted-foreground"> from last period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
