const KEY = "dh:myShares:v1";
const MAX_RECORDS = 50;

export interface MyShare {
  id: string;
  url: string;
  createdAt: number;
  count: number;
  /** 撤销令牌；旧记录可能没有（不可远程撤销，仅可移除本地记录） */
  token?: string;
}

export function loadMyShares(): MyShare[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is MyShare => {
      const r = x as MyShare;
      return typeof r?.id === "string" && typeof r?.url === "string" && typeof r?.createdAt === "number" && typeof r?.count === "number";
    });
  } catch {
    return [];
  }
}

function save(list: MyShare[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_RECORDS)));
  } catch {
    // 存不了不影响主流程
  }
}

export function addMyShare(record: MyShare): MyShare[] {
  const list = [record, ...loadMyShares().filter((s) => s.id !== record.id)];
  save(list);
  return list.slice(0, MAX_RECORDS);
}

export function removeMyShare(id: string): MyShare[] {
  const list = loadMyShares().filter((s) => s.id !== id);
  save(list);
  return list;
}
