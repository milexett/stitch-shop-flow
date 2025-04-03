
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const statusClasses: Record<string, string> = {
  // Order statuses
  pending: "bg-warning-100 text-warning-800",
  approved: "bg-info-100 text-info-800",
  in_production: "bg-info-100 text-info-800",
  completed: "bg-success-100 text-success-800",
  cancelled: "bg-destructive/20 text-destructive",
  
  // Production task statuses
  in_progress: "bg-info-100 text-info-800",
  on_hold: "bg-muted text-muted-foreground",
  
  // Inventory statuses
  low: "bg-warning-100 text-warning-800",
  ok: "bg-success-100 text-success-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  in_production: "In Production",
  completed: "Completed",
  cancelled: "Cancelled",
  in_progress: "In Progress",
  on_hold: "On Hold",
  low: "Low Stock",
  ok: "In Stock",
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase().replace(/_/g, '_');
  
  return (
    <span 
      className={cn(
        "status-badge",
        statusClasses[normalizedStatus] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {statusLabels[normalizedStatus] || status}
    </span>
  );
};

export default StatusBadge;
