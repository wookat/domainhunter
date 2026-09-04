// 合成 dh:lastSearch:v1（sessionStorage）恢复态 fixture —— 0 次 AI 调用
const sc = (l, r, rel, b) => ({ length: l, readability: r, relevance: rel, brandability: b });
const mk = (label, tld, status, meaning, theme, s) => ({ domain: `${label}.${tld}`, label, tld, status, meaning, theme, scores: s, round: 1 });

function rows(lang) {
  const zh = lang !== "en";
  return [
    mk("lumora", "com", "available", zh ? "「流光」lumi + aura，寓意灵动的光感体验" : "lumi + aura: a glowing, agile brand feel", "coined", sc(92, 90, 88, 86)),
    mk("teagrove", "com", "available", zh ? "tea + grove，茶园林间的自然意象" : "tea + grove: a natural tea-garden image", "word", sc(84, 92, 90, 80)),
    mk("qingyuan", "cn", "available", zh ? "「清源」清澈之源，中文语感佳" : "qing yuan: clear source (pinyin)", "pinyin", sc(80, 78, 86, 74)),
    mk("penfold", "com", "available", zh ? "pen + fold，简洁易记" : "pen + fold: short and memorable", "blend", sc(90, 88, 72, 78)),
    mk("castloom", "com", "available", zh ? "cast + loom，编织之意" : "cast + loom: weaving imagery", "blend", sc(82, 84, 70, 76)),
    mk("verbloom", "com", "available", zh ? "verb + bloom，动感成长" : "verb + bloom: growth in motion", "coined", sc(84, 82, 74, 80)),
    mk("anvilio", "com", "available", zh ? "anvil 变体，工匠感" : "anvil variant: craftsman feel", "coined", sc(80, 80, 66, 72)),
    mk("teagrove", "cn", "available", zh ? "同上，.cn 备选" : "same, .cn alternative", "word", sc(84, 92, 90, 70)),
    mk("lumora", "cn", "taken", zh ? "已注册" : "taken", "coined", sc(92, 90, 88, 86)),
    mk("penfold", "cn", "taken", zh ? "已注册" : "taken", "blend", sc(90, 88, 72, 78)),
    mk("brewnest", "com", "taken", zh ? "已注册" : "taken", "word", sc(80, 86, 80, 70)),
  ];
}

function fixture(lang) {
  const zh = lang !== "en";
  return {
    values: {
      description: zh ? "面向年轻人的新式茶饮品牌，清新自然，带一点国潮气质" : "A modern tea brand for young people, fresh and natural with a hint of heritage",
      tlds: ["com", "cn"],
      style: "",
      lengthPref: "",
    },
    rows: rows(lang),
    rounds: [{ round: 1, noteKey: "agent.note.first", proposed: 11, checked: 11, available: 8 }],
    elapsedSec: 23,
    aiUnderstanding: zh
      ? { core: "年轻化新式茶饮品牌，清新自然带国潮感", style: "清新、自然、国潮", scene: "茶饮零售品牌" }
      : { core: "youthful modern tea brand, fresh and natural", style: "fresh, natural, heritage", scene: "tea retail brand" },
    refinements: [],
    triedLabels: ["lumora", "teagrove", "qingyuan", "penfold", "castloom", "verbloom", "anvilio", "brewnest"],
    locked: [],
  };
}

module.exports = { fixture };
