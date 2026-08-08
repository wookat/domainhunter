import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 两步确认按钮的文案：普通态/确认态两种文案叠放在同一格，隐藏未激活的一个，
 * 按钮宽度恒为两者最大值。进入确认态时按钮不发生位移/换行，
 * 用户在原位置的第二次单击才能命中按钮立即执行动作。
 */
export function ConfirmLabel({ confirmed, label, confirmLabel }: { confirmed: boolean; label: ReactNode; confirmLabel: ReactNode }) {
  return (
    <span className="grid justify-items-center">
      <span aria-hidden={confirmed} className={cn("col-start-1 row-start-1 flex items-center gap-1.5 whitespace-nowrap", confirmed && "invisible")}>
        {label}
      </span>
      <span aria-hidden={!confirmed} className={cn("col-start-1 row-start-1 flex items-center gap-1.5 whitespace-nowrap font-semibold", !confirmed && "invisible")}>
        {confirmLabel}
      </span>
    </span>
  );
}
