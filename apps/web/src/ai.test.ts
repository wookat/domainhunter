import { describe, expect, it } from "vitest";
import { citedSplit, normalizeTheme, stripToneClaims, TONE_CLAIM_RE } from "./ai";

// R499（R494 审计 P3-1 / P3-2）：解析后 theme 归一 + zh meaning 声调/平仄描述剥离。
// 用例取自 docs/audits/r494/ai-search-0{1..6}.ndjson 生产回放坏例；完整 137 条回放见 scripts/verify-r499.mjs

describe("normalizeTheme（R499 P3-1）", () => {
  it("Z1：zh 全拼标 blend 且「」引用词逐字全拼等于 label → pinyin（zhangwubao「账务宝」）", () => {
    expect(normalizeTheme("zhangwubao", "「账务宝」zhangwubao，全拼加英文，寓意财务的贴心管家，读来亲切好记。", "blend", "zh")).toBe("pinyin");
  });

  it("Z1 边界：pan 引「盘」→ pinyin；pan 未引「」的英文词解释 → 保留 word", () => {
    expect(normalizeTheme("pan", "「盘」pan，取盘活资产之意", "word", "zh")).toBe("pinyin");
    expect(normalizeTheme("pan", "pan is a real English word for a cooking pan", "word", "en")).toBe("word");
  });

  it("Z1 不在 en 描述场景（enPinyinDrop）下生效，避免归一到即将丢弃的拼音路线", () => {
    expect(normalizeTheme("zhangwubao", "「账务宝」zhangwubao，全拼加英文", "blend", "zh", false)).toBe("blend");
  });

  it("Z2：zh 两词拼接标 word，meaning 自述拆解 → coined（R494 6 条坏例）", () => {
    const cases: [string, string][] = [
      ["cuddlepup", "cuddle 是拥抱，pup 是小狗，寓意给小狗一个温暖拥抱，辅音融合读感柔软"],
      ["fluffnest", "fluff 是绒毛，nest 是巢穴，寓意宠物窝在柔软绒毛里像回到巢穴般安心，双词组合画面感强"],
      ["barkbite", "bark 是犬吠，bite 是咬合，寓意狗狗对零食的热情反馈，两个音节押韵上口"],
      ["furbuddy", "fur 是毛发，buddy 是伙伴，寓意毛发蓬松的宠物就是最贴心的伙伴，整体读来亲切自然"],
      ["nibblenest", "nibble 是小口啃咬，nest 是窝，寓意宠物在窝里小口啃零食的温馨画面，双词和谐有韵律"],
      ["pawlab", "paw 是爪子，lab 是实验室，寓意用科研精神打磨每一款宠物用品，两个音节短促有力好记"],
    ];
    for (const [label, meaning] of cases) expect(normalizeTheme(label, meaning, "word", "zh"), label).toBe("coined");
  });

  it("Z2：拆出的段是「」引用词拼音 → blend（拼音+英文混合）", () => {
    expect(normalizeTheme("maopals", "「猫」mao 与 pals 朋友组合，猫是人类的伙伴", "word", "zh")).toBe("blend");
  });

  it("E1：en 两词拼接标 word → blend；S1：harborly（harbor + -ly）标 blend → coined", () => {
    expect(normalizeTheme("calmroot", "calm + root: a foundation of steady routines; two clear words", "word", "en")).toBe("blend");
    expect(normalizeTheme("harborly", "harbor as a noun evokes shelter, plus a -ly suffix for a friendly brand voice", "blend", "en")).toBe("coined");
  });

  it("不确定时保留模型标注：未被拆解的合成词、拼音+英文混搭、含数字、拆不出的 blend、真实词 word", () => {
    expect(normalizeTheme("sunflower", "a bright name for a garden app", "word", "en")).toBe("word");
    // 词汇化复合词：模型按两段解释也保留 word（R494 审计判 munchkin 标 word ✓）
    expect(normalizeTheme("munchkin", "munch 是用力咀嚼，kin 是亲属，寓意宠物像家人一样大口吃零食", "word", "zh")).toBe("word");
    expect(normalizeTheme("sunflower", "sun + flower, a bright name for a garden app", "word", "en")).toBe("word");
    expect(normalizeTheme("caiwuhub", "「财务枢纽」caiwuhub，拼音加英文组合，寓意企业财务的中枢节点", "blend", "zh")).toBe("blend");
    expect(normalizeTheme("pet2go", "pet 是宠物，go 是出发", "word", "zh")).toBe("word");
    expect(normalizeTheme("complainter", "commit + planner: a tool that turns intentions into enduring habits", "blend", "en")).toBe("blend");
    expect(normalizeTheme("anchor", "A real English word for the ship's anchor, symbolizing stability", "word", "en")).toBe("word");
    expect(normalizeTheme("focusly", "focus + a light -ly twist", "coined", "en")).toBe("coined");
    expect(normalizeTheme("qishu", "「启数」，qi 取「启」的开启，shu 取「数」的财税数据", "pinyin", "zh")).toBe("pinyin");
  });

  it("citedSplit：按 meaning 引用词段无缝拆分，取段数最少；拆不出返回 null", () => {
    expect(citedSplit("cuddlepup", "cuddle 是拥抱，pup 是小狗", 2)).toEqual(["cuddle", "pup"]);
    expect(citedSplit("pawfect", "paw 是爪子，fect 取自 perfect 的尾音", 2)).toEqual(["paw", "fect"]);
    expect(citedSplit("harborly", "harbor as a noun, plus a -ly suffix", 3)).toBeNull();
    expect(citedSplit("anchor", "anchor is a real word", 3)).toBeNull();
  });
});

describe("stripToneClaims（R499 P3-2）", () => {
  it("R494 4 例声调错误：子句整句删除，候选保留，「」引用词保留，无悬空标点", () => {
    const cases: [string, string][] = [
      [
        "「乐薪」，le 取「乐」的省心与顺畅，xin 取「薪」的薪酬与财务，读来明快，声调一升一平，响度充足，天然带愉悦与信赖感。",
        "「乐薪」，le 取「乐」的省心与顺畅，xin 取「薪」的薪酬与财务，读来明快，响度充足，天然带愉悦与信赖感。",
      ],
      ["「账平」zhangping，双字全拼，寓意账目平衡、稳健可靠，声调先升后平，读来安稳踏实。", "「账平」zhangping，双字全拼，寓意账目平衡、稳健可靠，读来安稳踏实。"],
      [
        "「暖趴」nuanpa，暖是温度，趴是动物伏卧的慵懒姿态，暖字的第二声接趴字的第一声，读着就像看毛孩子舒服地趴在你腿边。",
        "「暖趴」nuanpa，暖是温度，趴是动物伏卧的慵懒姿态，读着就像看毛孩子舒服地趴在你腿边。",
      ],
      ["「花枝」双字全拼，huā zhī 声调一升一平，发音轻快，花枝意象天然带出国风雅致，贴合花果茶主题，读来朗朗上口。", "「花枝」双字全拼，发音轻快，花枝意象天然带出国风雅致，贴合花果茶主题，读来朗朗上口。"],
    ];
    for (const [input, want] of cases) {
      const t = stripToneClaims(input);
      expect(t.stripped).toBe(true);
      expect(t.meaning).toBe(want);
      expect(TONE_CLAIM_RE.test(t.meaning)).toBe(false);
    }
  });

  it("句末子句被删时恢复句号；无句号原文不补；阳平/平仄/从仄到平 等变体均识别", () => {
    expect(stripToneClaims("「秋禾」qiuhe，秋日丰收的禾谷，声调先平后升。")).toEqual({ meaning: "「秋禾」qiuhe，秋日丰收的禾谷。", stripped: true });
    expect(stripToneClaims("「中茂」双字全拼，取中华与茂盛之意，声调平仄相间，读来有韵律")).toEqual({ meaning: "「中茂」双字全拼，取中华与茂盛之意，读来有韵律", stripped: true });
    expect(stripToneClaims("「清和」qinghe，清雅与平和，后鼻音加次阳平，读来舒缓稳重。").meaning).toBe("「清和」qinghe，清雅与平和，读来舒缓稳重。");
    expect(stripToneClaims("「木兮」muxi，古典雅致，声调从仄到平，读起来轻快柔和。").meaning).toBe("「木兮」muxi，古典雅致，读起来轻快柔和。");
  });

  it("不含声调描述的 meaning 原样返回；「一声友好的招呼」「闻一声」不是声调判断，不误删", () => {
    const plain = "「猫」mao 与 pals 朋友组合，猫是人类的伙伴，读音干脆亲切，整体像一声友好的招呼，记忆点鲜明。";
    expect(stripToneClaims(plain)).toEqual({ meaning: plain, stripped: false });
    expect(stripToneClaims("cuddle 是拥抱，pup 是小狗，寓意给小狗一个温暖拥抱").stripped).toBe(false);
  });

  it("含「」引用词的子句即使带声调描述也不删（保住拼音一致性校验依据）；全句都是声调描述时不剥离", () => {
    const t = stripToneClaims("「花枝」huazhi 声调一升一平，花枝意象雅致。");
    expect(t.meaning).toBe("「花枝」huazhi 声调一升一平，花枝意象雅致。");
    expect(t.stripped).toBe(false);
    expect(stripToneClaims("声调一升一平，先升后平")).toEqual({ meaning: "声调一升一平，先升后平", stripped: false });
  });
});
