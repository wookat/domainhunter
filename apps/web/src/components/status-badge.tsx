import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type Status } from "@/types";

export function StatusBadge({ status }: { status: Status }) {
  if (status === "available")
    return (
      <Badge variant="available" className="shrink-0">
        <Check className="h-3 w-3" />
        {STATUS_LABEL.available}
      </Badge>
    );
  if (status === "taken")
    return (
      <Badge variant="taken" className="shrink-0">
        <X className="h-3 w-3" />
        {STATUS_LABEL.taken}
      </Badge>
    );
  if (status === "checking")
    return (
      <Badge variant="checking" className="shrink-0 gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        {STATUS_LABEL.checking}
      </Badge>
    );
  return (
    <Badge variant="unknown" className="shrink-0">
      {STATUS_LABEL.unknown}
    </Badge>
  );
}
