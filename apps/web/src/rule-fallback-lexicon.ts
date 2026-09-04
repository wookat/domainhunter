// R489：规则降级路线的中文小词表（0 AI、无依赖）。三张表都只提供「选哪个字 / 配哪个英文」的语义提示，
// 读音一律以 R222 GB2312 拼音表为准：表里写的读音必须是 pinyinReadingsOf(ch) 返回值之一，
// 运行期（rule-fallback.ts charReading）逐字校验，不一致即放弃该字（fail-closed），不会产出表外拼音声称。

/**
 * 创业描述高频多音字的首选读音。R222 表把 pinyin-data 的文言/罕见读音追加在常用读音之后
 * （叶 ye/xie、立 li/wei、温 wen/yun…），R471 的「多音字一律放弃」让茶叶/独立/温暖/光明/健身 等核心词整词丢失。
 * 这里只收「日常语境下读音基本唯一」的字；真多音字（长 chang/zhang、行 xing/hang、重、乐、得、地、的…）不收，仍放弃。
 */
export const ZH_PREFERRED_READING: Readonly<Record<string, string>> = {
  叶: "ye", 立: "li", 母: "mu", 温: "wen", 暖: "nuan", 跨: "kua", 能: "neng", 家: "jia", 居: "ju", 技: "ji", 明: "ming",
  咖: "ka", 啡: "fei", 活: "huo", 儿: "er", 育: "yu", 身: "shen", 达: "da", 鑫: "xin", 信: "xin", 趣: "qu", 喜: "xi",
  泽: "ze", 萌: "meng", 净: "jing", 和: "he", 盛: "sheng", 拓: "tuo", 舒: "shu", 宁: "ning", 蓝: "lan", 青: "qing",
  亲: "qin", 捷: "jie", 童: "tong", 食: "shi", 宿: "su", 果: "guo", 车: "che", 房: "fang", 摄: "she", 游: "you",
  服: "fu", 餐: "can", 区: "qu", 频: "pin", 招: "zhao", 聘: "pin", 支: "zhi", 零: "ling", 售: "shou", 数: "shu",
  汽: "qi", 培: "pei", 读: "du", 包: "bao", 吃: "chi", 鞋: "xie", 灯: "deng", 园: "yuan", 猫: "mao", 族: "zu",
  // R493：创业描述高频字里被 R222 罕见读音误伤的（客 ke/qia、大 da/dai/tai、告 gao/ju/gu、平 ping/pian…），日常读音唯一
  客: "ke", 大: "da", 告: "gao", 感: "gan", 平: "ping", 台: "tai", 洗: "xi", 研: "yan", 税: "shui", 内: "nei", 容: "rong",
  识: "shi", 广: "guang", 员: "yuan", 戏: "xi", 印: "yin", 洁: "jie", 搬: "ban", 租: "zu", 共: "gong", 团: "tuan", 拼: "pin",
  积: "ji", 白: "bai", 红: "hong", 硬: "ying", 片: "pian", 机: "ji", 无: "wu", 池: "chi", 露: "lu", 眼: "yan", 幸: "xing",
  由: "you", 任: "ren", 约: "yue", 古: "gu", 治: "zhi", 伴: "ban", 接: "jie", 注: "zhu", 致: "zhi", 赢: "ying", 洋: "yang",
  月: "yue", 太: "tai",
};

/**
 * 常用寓意字（中文创业命名高频单字）→ 首选读音。描述里的寓意词命中其中的字（清雅 → 清/雅、启蒙智慧 → 启/智/慧）
 * 即成为可与行业核心字组合的「寓意字」。刻意不收 思/斯/司(si)、比/碧(bi) 等与禁忌音节同音的字。
 */
export const ZH_BRAND_CHARS: Readonly<Record<string, string>> = {
  吉: "ji", 祥: "xiang", 云: "yun", 智: "zhi", 优: "you", 达: "da", 慧: "hui", 悦: "yue", 清: "qing", 雅: "ya",
  安: "an", 心: "xin", 温: "wen", 暖: "nuan", 明: "ming", 光: "guang", 星: "xing", 瑞: "rui", 鑫: "xin", 诚: "cheng",
  信: "xin", 美: "mei", 乐: "le", 享: "xiang", 趣: "qu", 悠: "you", 简: "jian", 臻: "zhen", 恒: "heng", 卓: "zhuo",
  福: "fu", 喜: "xi", 聚: "ju", 源: "yuan", 初: "chu", 新: "xin", 润: "run", 泽: "ze", 航: "hang", 远: "yuan",
  启: "qi", 萌: "meng", 力: "li", 健: "jian", 康: "kang", 慢: "man", 艺: "yi", 文: "wen", 净: "jing", 纯: "chun",
  真: "zhen", 善: "shan", 和: "he", 顺: "shun", 兴: "xing", 旺: "wang", 盛: "sheng", 华: "hua", 宏: "hong", 泰: "tai",
  升: "sheng", 跃: "yue", 飞: "fei", 翔: "xiang", 拓: "tuo", 创: "chuang", 巧: "qiao", 灵: "ling", 妙: "miao", 舒: "shu",
  宁: "ning", 静: "jing", 蓝: "lan", 青: "qing", 金: "jin", 玉: "yu", 宝: "bao", 亲: "qin", 潮: "chao", 捷: "jie",
  极: "ji", 速: "su", 快: "kuai", 轻: "qing", 匠: "jiang", 尚: "shang",
  海: "hai", 天: "tian", 阳: "yang", 森: "sen", 晨: "chen", 山: "shan", 稳: "wen",
};

/**
 * 抽象寓意词 → 寓意字（覆盖「字不在词里」的近义映射；词里本来就有的寓意字由 ZH_BRAND_CHARS 隐式命中，不必列）。
 * meaning 里对近义字如实标注「近义字」。
 */
export const ZH_MEANING_SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  活泼: ["悦", "灵"], 向上: ["升", "跃"], 科技感: ["智", "创"], 未来: ["新", "启"], 时尚: ["潮", "尚"], 年轻: ["青", "新"],
  轻松: ["悠", "轻"], 高端: ["臻", "尚"], 可靠: ["诚", "信"], 温馨: ["暖", "安"], 治愈: ["暖", "悦"], 精致: ["雅", "臻"],
  自然: ["净", "青"], 阳光: ["光", "明"], 极简: ["简"], 高效: ["捷", "速"], 专业: ["匠", "臻"], 亲切: ["亲", "和"],
  国潮: ["潮", "华"], 品质: ["臻", "优"], 环保: ["净", "青"], 快乐: ["乐", "悦"], 幸福: ["福", "悦"], 成长: ["升", "萌"],
};

export interface ZhIndustryEntry {
  /** 行业核心字（须是词中的字），与寓意字组成双字短拼音；无合适单字则只用英文 */
  core?: string;
  /** 1–2 个短英文（≤6 字母），用于拼音+英文混搭 */
  en: readonly string[];
  /** 全拼覆盖（词内含真多音字、按首选读音拼不对时给出，逐字仍须在表内） */
  py?: string;
}

/** 行业词 → 核心字 + 短英文。最长匹配切词（4→3→2 字）也用这张表与 ZH_MEANING_SYNONYMS 的键做词边界 */
export const ZH_INDUSTRY: Readonly<Record<string, ZhIndustryEntry>> = {
  茶叶: { core: "茶", en: ["tea"] }, 茶饮: { core: "茶", en: ["tea"] }, 奶茶: { core: "茶", en: ["tea"] }, 茶馆: { core: "茶", en: ["tea"] },
  咖啡: { en: ["cafe", "coffee"] }, 咖啡馆: { en: ["cafe"] }, 烘焙: { en: ["bake"] }, 甜点: { core: "甜", en: ["sweet"] }, 蛋糕: { en: ["cake"] },
  美食: { core: "食", en: ["food"] }, 餐饮: { en: ["food"] }, 餐厅: { en: ["food"] }, 外卖: { en: ["food"] }, 火锅: { en: ["pot"] },
  生鲜: { core: "鲜", en: ["fresh"] }, 水果: { core: "果", en: ["fruit"] }, 农产品: { core: "农", en: ["farm"] }, 农业: { core: "农", en: ["farm"] },
  电商: { en: ["shop", "mall"] }, 跨境: { en: ["global", "go"] }, 零售: { en: ["shop"] }, 商城: { en: ["mall"] }, 团购: { en: ["deal"] },
  宠物: { core: "宠", en: ["pet"] }, 猫咪: { core: "猫", en: ["cat"] }, 狗狗: { en: ["dog"] },
  开发者: { en: ["dev"] }, 开发: { en: ["dev", "code"] }, 编程: { en: ["code"] }, 程序: { en: ["code"] }, 程序员: { en: ["dev"] }, 软件: { en: ["soft"] },
  记账: { core: "账", en: ["ledger", "book"] }, 财务: { core: "财", en: ["fin"] }, 理财: { core: "财", en: ["fin"] }, 支付: { core: "付", en: ["pay"] },
  金融: { core: "金", en: ["fin"] }, 保险: { en: ["safe"] },
  云端: { core: "云", en: ["cloud"] }, 云计算: { core: "云", en: ["cloud"] }, 云服务: { core: "云", en: ["cloud"] }, 数据: { en: ["data"] },
  智能: { core: "智", en: ["smart"] }, 科技: { en: ["tech"] }, 硬件: { en: ["tech"] }, 机器人: { en: ["bot"] },
  母婴: { core: "婴", en: ["baby", "mom"] }, 儿童: { core: "童", en: ["kid"] }, 少儿: { en: ["kid"] }, 亲子: { core: "亲", en: ["kid"] }, 玩具: { core: "玩", en: ["toy"] },
  家居: { core: "家", en: ["home"] }, 家具: { core: "家", en: ["home"] }, 家装: { core: "家", en: ["deco"] }, 装修: { en: ["deco"] }, 房产: { core: "房", en: ["home"] },
  健身: { core: "健", en: ["fit"] }, 运动: { en: ["sport"] }, 瑜伽: { en: ["yoga"] }, 健康: { core: "康", en: ["health", "care"] }, 医疗: { core: "医", en: ["care", "med"] },
  教育: { en: ["edu", "learn"] }, 培训: { en: ["learn"] }, 课程: { core: "课", en: ["class"] }, 学习: { core: "学", en: ["learn"] }, 阅读: { en: ["read", "book"] }, 书店: { core: "书", en: ["book"] },
  旅行: { core: "旅", en: ["trip", "go"] }, 旅游: { core: "旅", en: ["trip"] }, 民宿: { core: "宿", en: ["stay"] }, 酒店: { en: ["stay", "hotel"] }, 出行: { en: ["go"] },
  设计: { en: ["design"] }, 摄影: { core: "影", en: ["photo"] }, 音乐: { en: ["music"], py: "yinyue" }, 游戏: { core: "游", en: ["game", "play"] }, 视频: { en: ["video"] }, 直播: { en: ["live"] },
  服装: { en: ["wear"] }, 服饰: { en: ["wear"] }, 美妆: { core: "妆", en: ["beauty"] }, 护肤: { en: ["skin"] },
  汽车: { core: "车", en: ["car", "auto"] }, 物流: { en: ["ship"] }, 快递: { en: ["ship"] },
  新能源: { en: ["energy", "ev"] }, 充电桩: { core: "充", en: ["charge"] }, 客服: { core: "客", en: ["chat"] },
  花店: { core: "花", en: ["flower", "bloom"] }, 鲜花: { core: "花", en: ["bloom"] }, 婚礼: { core: "婚", en: ["wed"] }, 婚庆: { core: "婚", en: ["wed"] },
  生活: { en: ["life"] }, 社区: { en: ["club"] }, 社交: { en: ["meet"] }, 招聘: { en: ["hire", "job"] }, 办公: { en: ["work"] }, 笔记: { core: "记", en: ["note"] }, 日程: { en: ["plan"] },
  法律: { core: "法", en: ["law"] }, 文创: { core: "文", en: ["art"] }, 手工: { en: ["craft"] }, 礼品: { core: "礼", en: ["gift"] }, 工作室: { en: ["studio"] },
};

/** 拼音组合里禁止出现的音节（国内敏感/低俗谐音与「4」类忌讳），只作用于规则生成的拼音组合 */
export const ZH_TABOO_SYLLABLES: ReadonlySet<string> = new Set(["cao", "diao", "bi", "sha", "sao", "ri", "si"]);
