import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Report } from "../types";

interface StatusBadgeProps {
  status: Report["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap = {
    submitted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    late: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusMap[status]}`}>
      {status === "submitted" && <CheckCircle2 size={9} />}
      {status === "pending" && <Clock size={9} />}
      {status === "late" && <AlertCircle size={9} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
