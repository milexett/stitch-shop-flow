
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
};

const StatCard = ({ title, value, description, icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && <div className="text-muted-foreground/60">{icon}</div>}
      </div>
      
      {trend && (
        <div className="mt-2">
          <span className={cn(
            "text-xs font-medium inline-flex items-center",
            trend.direction === 'up' && "text-success-600",
            trend.direction === 'down' && "text-destructive",
            trend.direction === 'neutral' && "text-muted-foreground"
          )}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
