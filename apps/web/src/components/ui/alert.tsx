import * as React from "react";

import { cn } from "@/lib/utils";

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn("relative w-full rounded-xl border p-4", className)} {...props} />
  ),
);
Alert.displayName = "Alert";

export { Alert };
