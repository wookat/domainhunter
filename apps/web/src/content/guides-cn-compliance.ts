/**
 * .cn 合规与流程指南（/guide/:slug，kind = "compliance"）——中文创业者拿到 .cn/.com.cn 之后的独有痛点：
 * 实名认证、serverHold、ICP 备案、境内/境外解析、.cn 与 .com.cn 及注册商选择、到期赎回。
 * 全部规则忠实于 docs/research/cn-compliance-content.md 核实结果（查阅日期 2026-09-04）：
 * 「注册商口径」= 阿里云/腾讯云/西部数码帮助中心执行口径，非注册局统一规则；未核实事项在正文明确写「未核实」。
 * 与 INDUSTRY_GUIDES 共用数据模型：namingIdeas/cases 为空，正文走 sections；FAQ 显式给出（buildGuideFaq 优先取用）。
 */
import type { IndustryGuide } from "./guides";

const CN_TLD = { tld: "cn", zh: "中国国家顶级域名，由 CNNIC 运营；本文规则均针对 .cn/.com.cn 等 CNNIC 域名", en: "China's ccTLD run by CNNIC; every rule in this guide applies to .cn / .com.cn and other CNNIC domains" };

const SRC = {
  cnnicRules: { url: "https://www.cnnic.cn/n4/2022/0817/c93-335.html", zh: "CNNIC《国家顶级域名注册实施细则》", en: "CNNIC — Implementing Rules for National Top-Level Domain Name Registration" },
  cnnicFaq: { url: "https://www.cnnic.cn/n4/2022/0919/c90-10605.html", zh: "CNNIC《中国域名注册常见问题及解答》", en: "CNNIC — Domain registration FAQ" },
  cnnicRegistrar: { url: "https://www.cnnic.cn/n4/2022/0916/c174-10601.html", zh: "CNNIC 认证注册服务机构说明", en: "CNNIC — Accredited registrars" },
  miitNotice: { url: "https://www.miit.gov.cn/jgsj/xgj/hlwgl/art/2020/art_f4e6b2b5bc6b400ea35b5d7294a960bd.html", zh: "工信部《关于规范互联网信息服务使用域名的通知》", en: "MIIT — Notice on regulating domain names used by internet information services" },
  miitBeian: { url: "https://www.miit.gov.cn/zwgk/zcwj/flfg/art/2017/art_43ec3819b2d04a31ad2c1c81c3f6100b.html", zh: "工信部《非经营性互联网信息服务备案管理办法》", en: "MIIT — Measures for the filing of non-commercial internet information services" },
  miitDomainSystem: { url: "https://domain.miit.gov.cn/chinayu.jsp", zh: "工信部《中国互联网络域名体系》", en: "MIIT — China internet domain name system" },
  aliRealname: { url: "https://help.aliyun.com/zh/dws/user-guide/how-to-complete-domain-name-authentication", zh: "阿里云《域名实名认证》", en: "Alibaba Cloud — Domain real-name verification" },
  aliServerHold: { url: "https://help.aliyun.com/zh/dws/support/how-to-unlock-a-domain-name-that-is-in-the-serverhold-or-clienthold-state", zh: "阿里云《serverHold/clientHold 状态解锁》", en: "Alibaba Cloud — Unlocking serverHold / clientHold" },
  aliBeianDomainFaq: { url: "https://help.aliyun.com/zh/icp-filing/basic-icp-service/support/for-the-record-domain-faq", zh: "阿里云《备案域名 FAQ》", en: "Alibaba Cloud — ICP filing domain FAQ" },
  aliBeianScenario: { url: "https://help.aliyun.com/zh/icp-filing/basic-icp-service/product-overview/faq-about-icp-filing-applications-in-different-scenarios", zh: "阿里云《不同场景下的 ICP 备案说明 FAQ》", en: "Alibaba Cloud — ICP filing scenarios FAQ" },
  aliBeianDomainPrep: { url: "https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name", zh: "阿里云《准备与检查域名》", en: "Alibaba Cloud — Prepare and check the domain" },
  aliRedeem: { url: "https://www.alibabacloud.com/help/zh/dws/user-guide/redeem-a-domain-name", zh: "阿里云《域名赎回》", en: "Alibaba Cloud — Redeem a domain" },
  tcRealname: { url: "https://cloud.tencent.com/document/product/242/6707", zh: "腾讯云《域名实名认证》", en: "Tencent Cloud — Domain real-name verification" },
  tcServerHold: { url: "https://cloud.tencent.com/document/product/242/54080", zh: "腾讯云《域名注册局暂停解析（serverHold）状态》", en: "Tencent Cloud — serverHold status" },
  tcRenew: { url: "https://www.tencentcloud.com/zh/document/product/242/42863", zh: "腾讯云《域名续费相关》", en: "Tencent Cloud — Domain renewal FAQ" },
  westRealname: { url: "https://www.west.cn/docs/123301.html", zh: "西部数码《域名多久实名成功》", en: "West.cn — How long does real-name verification take" },
  westServerHold: { url: "https://gd.west.cn/faq/list.asp?Unid=463", zh: "西部数码《域名 serverhold 状态说明》", en: "West.cn — serverHold explained" },
  webnic: { url: "https://faq.webnic.cc/cn/kb/cn-domain/", zh: "WebNIC《.CN 域名常见问题》（海外注册商示例）", en: "WebNIC — .CN domain FAQ (overseas registrar example)" },
} as const;

const src = (lang: "zh" | "en", ...keys: (keyof typeof SRC)[]) => keys.map((k) => ({ label: SRC[k][lang], url: SRC[k].url }));

export const CN_COMPLIANCE_GUIDES: Record<string, IndustryGuide> = {
  "cn-realname": {
    slug: "cn-realname",
    kind: "compliance",
    updatedAt: "2026-09-04",
    keywords: ["实名认证", "实名", "real-name", "CNNIC", "材料"],
    tlds: [CN_TLD],
    zh: {
      label: ".cn 实名认证",
      title: ".cn 域名实名认证全流程：材料、时限与审核",
      metaDescription: ".cn 域名实名认证要交什么材料、审核要多久、不做会怎样。按 CNNIC 细则与阿里云、腾讯云、西部数码官方帮助整理个人、企业、港澳台居民、外国人的材料清单，对照各家审核时限口径，说明未实名的 serverHold 后果与信息变更规则。",
      intro: "注册 .cn 域名不是付完钱就结束——按工信部 2017 年全面实名要求，所有存量与新注册域名都必须完成实名认证，注册商不得为未提供真实身份信息的域名提供解析。这篇指南把 CNNIC 细则原文与阿里云、腾讯云、西部数码三家帮助中心的执行口径放在一起对照：要交什么材料、审核大概多久、没实名会发生什么，以及信息变了怎么办。所有时限均标注出处，各家口径不一致处按原文并列，不替注册局做统一承诺。",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "为什么 .cn 一定要实名",
          paragraphs: [
            "CNNIC《国家顶级域名注册实施细则》第十九、二十条规定申请者必须提交身份证明：自然人提交姓名、身份证件号码、证件类型、通信地址、联系电话、电子邮箱；法人或非法人组织提交单位名称、组织证件号码、证件类型、通信地址、电话、邮箱。工信部《关于规范互联网信息服务使用域名的通知》进一步要求域名注册服务机构不得为未提供真实身份信息的域名提供解析服务——这就是「不实名就不能用」的法规源头。",
            "腾讯云帮助文档把这条落成了操作：所有存量域名与新注册域名均需实名认证，新注册时须先关联一个已通过审核的「信息模板」。也就是说实名不是注册后的可选步骤，而是注册流程的一部分。",
          ],
        },
        {
          heading: "要准备什么材料",
          paragraphs: ["材料按持有者类型区分，以下清单来自腾讯云与阿里云官方帮助，CNNIC FAQ 要求统一提交彩色电子件（原件扫描件、彩色复印件或拍照件），信息真实、准确、完整，且域名持有者名称必须与证件名称一致。"],
          bullets: [
            "中国内地企业：营业执照、组织机构代码证或统一社会信用代码证等单位证件",
            "中国内地个人：居民身份证",
            "港澳台居民：港澳居民来往内地通行证、台湾居民来往大陆通行证或港澳台居民居住证",
            "外国人：护照或外国人永久居留身份证",
            "通用：彩色电子件、证件清晰完整；持有者名称与证件一致，否则会被驳回",
          ],
        },
        {
          heading: "审核要多久：三家口径对照",
          paragraphs: [
            "审核由注册局侧完成，注册商负责收集并转交材料——西部数码帮助文档明确写道「实名审核资料非注册商审核，是上级审核机构，如中国互联网信息中心等」。因此不同注册商公布的时限只是各自的经验值，不是 CNNIC 的统一承诺。CNNIC FAQ 唯一给出的硬时限是：注册服务机构应在收到域名注册申请后一个工作日内向 CNNIC 提交注册信息。",
          ],
          bullets: [
            "腾讯云：信息模板审核一般 1–3 个工作日；域名关联已审核模板一般可立即完成，部分需 1 个工作日",
            "阿里云：信息模板与域名关联审核通常 1 个工作日，部分情况 3–5 个工作日",
            "西部数码：实名审核通常约 1–3 个工作日",
            "CNNIC：注册商收到申请后 1 个工作日内向 CNNIC 提交注册信息（细则要求）",
          ],
        },
        {
          heading: "没有实名会怎样",
          paragraphs: [
            "未通过实名审核的域名会被注册局置为 serverHold（注册局暂停解析）状态，网站与邮箱都无法正常使用。腾讯云文档指出审核通过后域名状态刷新为 OK 一般还需 1–2 个工作日；阿里云文档称解锁可能有约 1 个工作日延迟。阿里云《域名赎回》还提到：未完成实名认证的域名无法赎回——也就是说一个既过期又未实名的域名，连补救通道都会被关掉。",
            "西部数码的帮助文档描述 .cn 新注册后有「5 天注册信息审核期」，超期未通过实名会进入 serverHold。这是该注册商的流程描述，腾讯云与阿里云文档没有给出具体天数，本文不将其写成注册局统一规则。",
          ],
        },
        {
          heading: "实名信息变了怎么办",
          paragraphs: [
            "CNNIC 细则第二十五条要求域名注册信息发生变更后 30 日内办理变更手续。阿里云《备案域名 FAQ》补充了一个实务细节：实名信息修改后同步到工信部系统可能需要 2–3 天，如果你随后要做 ICP 备案，域名实名信息必须与备案主体一致，改完信息不要立刻提交备案。",
          ],
        },
      ],
      pitfalls: [
        "用公司域名却上传个人身份证：持有者名称与证件名称不一致会被直接驳回，先确定域名归个人还是公司再建信息模板",
        "把某一家注册商的「1 个工作日」当成承诺：审核在注册局侧完成，各家口径从 1 天到 5 个工作日不等，上线排期至少留一周",
        "注册后拖着不实名：进入 serverHold 后不仅无法解析，过期后还失去赎回资格",
        "实名信息刚改就提交备案：同步到工信部系统可能要 2–3 天，备案系统读到的是旧信息会被打回",
      ],
      faq: [
        { q: ".cn 域名实名认证要多久？", a: "审核由注册局侧完成，各注册商给出的时限口径不同：腾讯云为信息模板 1–3 个工作日、关联域名可立即或 1 个工作日；阿里云为通常 1 个工作日、部分 3–5 个工作日；西部数码为约 1–3 个工作日。CNNIC 细则只要求注册商在收到申请后 1 个工作日内提交注册信息，没有对审核完成时间做统一承诺。" },
        { q: "个人注册 .cn 需要什么材料？", a: "中国内地个人提交居民身份证彩色电子件；港澳台居民提交来往内地/大陆通行证或港澳台居民居住证；外国人提交护照或外国人永久居留身份证。持有者姓名必须与证件一致。" },
        { q: "企业注册 .cn 需要什么材料？", a: "营业执照、组织机构代码证或统一社会信用代码证等单位证件的彩色电子件，域名持有者名称必须与证件上的单位名称完全一致。" },
        { q: "不实名会怎么样？", a: "注册局会把域名置为 serverHold 状态，网站无法访问；审核通过后状态刷新为 OK 通常还要 1–2 个工作日（腾讯云口径）。此外阿里云文档指出未实名的域名过期后无法赎回。" },
      ],
      sources: src("zh", "cnnicRules", "cnnicFaq", "miitNotice", "aliRealname", "tcRealname", "westRealname", "aliRedeem"),
      cta: { title: "先查 .cn 是否可注册，再准备实名材料", desc: "用精确核验实时查 xxx.cn / xxx.com.cn 的注册状态与到期时间，不消耗 AI 额度。", button: "查 .cn 可注册状态" },
    },
    en: {
      label: ".cn real-name verification",
      title: ".cn Real-Name Verification, End to End: Documents, Timelines and Review",
      metaDescription: "Documents, timelines and consequences of .cn real-name verification. Compiled from the CNNIC rules and official Alibaba Cloud, Tencent Cloud and West.cn help docs: document lists for individuals, companies, HK/Macao/Taiwan residents and foreigners, side-by-side review timelines, serverHold consequences and change rules.",
      intro: "Paying for a .cn domain is not the end of the process. Under MIIT's 2017 universal real-name mandate, every existing and newly registered domain must pass real-name verification, and registrars may not resolve domains whose holders have not provided real identity information. This guide puts the CNNIC rules side by side with the operating guidance of Alibaba Cloud, Tencent Cloud and West.cn: what documents to submit, roughly how long review takes, what happens if you skip it, and what to do when your details change. Every timeline is sourced; where registrars disagree we list them as written and make no promise on the registry's behalf.",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "Why .cn requires real-name verification",
          paragraphs: [
            "Articles 19 and 20 of the CNNIC Implementing Rules require applicants to submit proof of identity: natural persons provide name, ID number and type, postal address, phone and email; legal persons and other organizations provide the organization name, certificate number and type, address, phone and email. MIIT's Notice on regulating domain names used by internet information services adds that registrars may not provide resolution for domains without real identity information — this is the legal root of 'no verification, no resolution'.",
            "Tencent Cloud's help centre turns that into procedure: all existing and new domains must be verified, and a new registration has to be linked to an already-approved 'information template'. Verification is part of the registration flow, not an optional afterthought.",
          ],
        },
        {
          heading: "Which documents to prepare",
          paragraphs: ["Documents depend on the holder type. The list below comes from Tencent Cloud and Alibaba Cloud's official help; the CNNIC FAQ requires colour electronic copies (scans, colour photocopies or photos of originals), truthful, accurate and complete, with the holder name matching the certificate exactly."],
          bullets: [
            "Mainland China company: business licence, organization code certificate or unified social credit code certificate",
            "Mainland China individual: resident ID card",
            "Hong Kong, Macao and Taiwan residents: mainland travel permit or the HK/Macao/Taiwan residence permit",
            "Foreign nationals: passport or foreign permanent resident ID card",
            "General: colour electronic copies, legible and complete; holder name must match the certificate or the application is rejected",
          ],
        },
        {
          heading: "How long review takes: three registrars compared",
          paragraphs: [
            "Review happens on the registry side; the registrar collects and forwards documents. West.cn's help doc states plainly that 'real-name documents are not reviewed by the registrar but by the superior authority such as CNNIC'. Published timelines are therefore each registrar's experience, not a CNNIC guarantee. The only hard deadline in the CNNIC FAQ is that a registrar must submit the registration data to CNNIC within one working day of receiving the application.",
          ],
          bullets: [
            "Tencent Cloud: information template review generally 1–3 working days; linking a domain to an approved template is usually immediate, sometimes 1 working day",
            "Alibaba Cloud: template and domain-link review usually 1 working day, in some cases 3–5 working days",
            "West.cn: real-name review typically about 1–3 working days",
            "CNNIC: registrar submits registration data to CNNIC within 1 working day of receiving the application",
          ],
        },
        {
          heading: "What happens without verification",
          paragraphs: [
            "A domain that has not passed verification is placed in serverHold (registry-suspended resolution) — websites and mailboxes stop working. Tencent Cloud notes that after approval the status usually takes another 1–2 working days to refresh to OK; Alibaba Cloud describes a delay of about one working day for unlocking. Alibaba Cloud's redemption doc adds that unverified domains cannot be redeemed — an expired, unverified domain loses even its rescue window.",
            "West.cn's help doc describes a '5-day registration review period' after which an unverified .cn enters serverHold. That is one registrar's process description; Tencent Cloud and Alibaba Cloud publish no specific day count, so this guide does not present it as a registry-wide rule.",
          ],
        },
        {
          heading: "When your details change",
          paragraphs: [
            "Article 25 of the CNNIC rules requires registration changes to be filed within 30 days. Alibaba Cloud's ICP filing domain FAQ adds a practical detail: updated real-name data can take 2–3 days to sync to MIIT's system, and because ICP filing requires the domain's real-name data to match the filing entity, you should not submit a filing immediately after editing the record.",
          ],
        },
      ],
      pitfalls: [
        "Uploading a personal ID for a company domain: any mismatch between holder name and certificate is rejected outright — decide whether the domain belongs to you or the company before creating the template",
        "Treating one registrar's 'one working day' as a promise: review is done at the registry; quoted timelines range from one day to five working days, so leave at least a week in your launch plan",
        "Registering and postponing verification: serverHold blocks resolution and, per Alibaba Cloud, an unverified domain also loses redemption rights after expiry",
        "Filing for ICP right after editing real-name data: the MIIT sync can take 2–3 days and the filing system will read stale data",
      ],
      faq: [
        { q: "How long does .cn real-name verification take?", a: "Review is done on the registry side and registrars quote different timelines: Tencent Cloud says 1–3 working days for the template and immediate to 1 working day for linking a domain; Alibaba Cloud says usually 1 working day, in some cases 3–5; West.cn says about 1–3 working days. The CNNIC rules only require the registrar to submit the data within 1 working day and make no promise on review completion." },
        { q: "What does an individual need to register a .cn?", a: "Mainland individuals submit a colour copy of their resident ID card; Hong Kong, Macao and Taiwan residents submit their mainland travel permit or residence permit; foreign nationals submit a passport or foreign permanent resident ID. The holder name must match the document." },
        { q: "What does a company need to register a .cn?", a: "A colour electronic copy of the business licence, organization code certificate or unified social credit code certificate; the domain holder name must exactly match the entity name on the certificate." },
        { q: "What happens if I skip verification?", a: "The registry places the domain in serverHold and the site stops resolving; after approval it usually takes another 1–2 working days for the status to return to OK (Tencent Cloud). Alibaba Cloud also states that unverified domains cannot be redeemed after expiry." },
      ],
      sources: src("en", "cnnicRules", "cnnicFaq", "miitNotice", "aliRealname", "tcRealname", "westRealname", "aliRedeem"),
      cta: { title: "Check whether the .cn is available before preparing documents", desc: "Exact check queries the live registration status and expiry of xxx.cn / xxx.com.cn without spending AI quota.", button: "Check .cn availability" },
    },
  },

  "cn-serverhold": {
    slug: "cn-serverhold",
    kind: "compliance",
    updatedAt: "2026-09-04",
    keywords: ["serverHold", "serverhold", "clientHold", "暂停解析", "无法访问"],
    tlds: [CN_TLD],
    zh: {
      label: "serverHold 解除",
      title: "域名 serverHold 是什么：为什么被暂停解析、怎么解除",
      metaDescription: "serverHold 是注册局暂停解析：四类原因、怎么解除、多久恢复。按腾讯云、阿里云、西部数码官方帮助整理四类原因（未实名、实名未通过、状态未刷新、滥用封禁）、与 clientHold 的区别、解除步骤与恢复时间，以及对 ICP 备案和赎回的连带影响。",
      intro: "很多中文创业者第一次遇到 serverHold，是网站突然打不开、去查 WHOIS 才发现域名状态不是 OK。serverHold 是注册局（对 .cn 而言就是 CNNIC）设置的「暂停解析」状态，DNS 不再生效，网站与邮箱一起停摆。这篇指南只讲已被官方帮助文档核实的内容：它由什么触发、和 clientHold 有什么区别、按什么顺序排查、解除后多久恢复，以及它会连带影响哪些后续动作。",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "serverHold 与 clientHold 的区别",
          paragraphs: [
            "两者都表现为域名无法解析，但设置方不同。serverHold 由注册局设置，注册商无权直接解除，必须满足注册局条件后由注册局刷新状态；clientHold 由注册商设置，常见于注册商侧的合规审查或欠费。阿里云的解锁文档把两者放在同一篇里，是因为用户看到的现象相同、处理路径却完全不同——先在 WHOIS 里确认是哪一种，再决定找谁。",
          ],
        },
        {
          heading: "四类常见原因",
          paragraphs: ["腾讯云《域名注册局暂停解析（serverHold）状态》把原因归为四类，这也是排查顺序："],
          bullets: [
            "域名未实名认证：注册后从未提交实名材料，注册局按工信部要求暂停解析",
            "域名已提交实名但未通过：材料被驳回（证件不清、名称不一致等），需重新提交",
            "实名已通过但状态尚未刷新：审核通过后状态刷新为 OK 一般需 1–2 个工作日，这段时间仍显示 serverHold",
            "域名存在滥用被注册局封禁：与实名无关，需向注册局说明情况申请解锁",
          ],
        },
        {
          heading: "什么时候会触发",
          paragraphs: [
            "对 .cn 来说，触发点几乎都落在实名环节。西部数码的帮助文档描述新注册 .cn 有「5 天注册信息审核期」，超期未通过实名会进入 serverHold；腾讯云与阿里云文档只写「未通过实名审核的域名会被暂停解析」，没有给出天数。因此可以确定的是「未实名会被 hold」，不能确定的是「第几天」——各注册商执行节奏不同，保险的做法是注册当天就提交材料。",
          ],
        },
        {
          heading: "解除步骤与恢复时间",
          paragraphs: [
            "解除路径取决于原因：未实名或实名未通过，去注册商控制台补交或重新提交材料；已通过但状态未刷新，等待即可；滥用封禁则需联系注册局。恢复时间各家口径：腾讯云称审核通过后 1–2 个工作日恢复 OK，另一篇实名文档称审核通过后 48 小时内恢复正常解析；阿里云称解锁可能有约 1 个工作日延迟；西部数码称通常次日解除。状态回到 OK 后，DNS 缓存还需要一段时间刷新，网站不会瞬间恢复。",
          ],
        },
        {
          heading: "连带影响：备案与赎回",
          paragraphs: [
            "serverHold 期间域名不能正常解析，而 ICP 备案要求域名已通过实名并处于正常状态，所以处于 serverHold 的域名无法推进备案。更要注意的是阿里云《域名赎回》的说明：未完成实名认证的域名无法赎回——一个既未实名又过期的域名，会直接失去补救机会。至于 serverHold 状态本身是否会导致域名被删除，官方文档没有正面说明，本文标记为未核实。",
          ],
        },
      ],
      pitfalls: [
        "把 serverHold 当成注册商故障去投诉：它是注册局状态，注册商只能转交材料，找错对象只会拖延",
        "刷新状态期间反复重新提交材料：审核通过到状态刷新有 1–2 个工作日空窗，重复提交可能重置排队",
        "在 serverHold 期间去提交 ICP 备案：备案要求域名已实名且状态正常，会被直接退回",
        "以为过期后再补实名就能赎回：未实名的域名无法赎回，实名要在到期前完成",
      ],
      faq: [
        { q: "serverHold 是什么意思？", a: "注册局设置的「暂停解析」状态。域名处于 serverHold 时 DNS 不生效，网站和邮箱都无法使用。对 .cn 而言，最常见的原因是没有通过实名认证；此外还包括实名未通过、审核通过后状态未刷新、以及域名滥用被注册局封禁。" },
        { q: "serverHold 和 clientHold 有什么区别？", a: "serverHold 由注册局设置，注册商无权直接解除；clientHold 由注册商设置。两者现象相同，处理对象不同，先在 WHOIS 里确认状态再联系对应方。" },
        { q: "解除 serverHold 要多久？", a: "补交或重新提交实名材料后，审核通过时腾讯云称一般 1–2 个工作日恢复 OK（另一篇文档称 48 小时内恢复解析），阿里云称约 1 个工作日，西部数码称通常次日。DNS 缓存刷新还需额外时间。" },
        { q: "serverHold 会导致域名被删除吗？", a: "官方文档没有正面说明，本文标记为未核实。可以确定的是：处于 serverHold 且未实名的域名过期后无法赎回（阿里云口径），所以务必在到期前完成实名。" },
      ],
      sources: src("zh", "tcServerHold", "aliServerHold", "westServerHold", "tcRealname", "aliRedeem", "miitNotice"),
      cta: { title: "查一下你的 .cn 现在是什么状态", desc: "精确核验直接读取 RDAP/WHOIS 状态与到期时间，不消耗 AI 额度。", button: "查域名状态" },
    },
    en: {
      label: "Fixing serverHold",
      title: "What serverHold Means: Why Your Domain Stopped Resolving and How to Lift It",
      metaDescription: "Why a domain lands in serverHold, how to lift it and how long recovery takes. Compiled from Tencent Cloud, Alibaba Cloud and West.cn official help: the four causes (unverified, verification rejected, status not yet refreshed, abuse ban), how it differs from clientHold, the steps and recovery time to lift it, and its knock-on effects on ICP filing and redemption.",
      intro: "Most Chinese founders meet serverHold the hard way: the site suddenly goes dark and a WHOIS lookup shows the domain is no longer OK. serverHold is a 'resolution suspended' status set by the registry — for .cn, CNNIC — so DNS stops working and website and email go down together. This guide covers only what official help documents confirm: what triggers it, how it differs from clientHold, the order to troubleshoot, how long recovery takes, and which downstream steps it blocks.",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "serverHold vs clientHold",
          paragraphs: [
            "Both stop the domain resolving, but a different party sets them. serverHold is set by the registry; the registrar cannot lift it directly and the registry refreshes the status once its conditions are met. clientHold is set by the registrar, typically for registrar-side compliance review or unpaid balances. Alibaba Cloud documents both in one article because the symptom is identical while the remedy differs — check WHOIS first to see which one you have, then decide whom to contact.",
          ],
        },
        {
          heading: "The four common causes",
          paragraphs: ["Tencent Cloud's serverHold article groups the causes into four, which is also the order to check:"],
          bullets: [
            "Domain never verified: no real-name documents submitted after registration, so the registry suspended resolution as MIIT requires",
            "Verification submitted but rejected: documents refused (blurry certificate, name mismatch, etc.) — resubmit",
            "Verification approved but status not yet refreshed: the status usually takes 1–2 working days to return to OK and shows serverHold in the meantime",
            "Domain banned by the registry for abuse: unrelated to verification — contact the registry to explain and request unlocking",
          ],
        },
        {
          heading: "When it is triggered",
          paragraphs: [
            "For .cn, the trigger is almost always the real-name step. West.cn's help doc describes a '5-day registration review period' after which an unverified .cn enters serverHold; Tencent Cloud and Alibaba Cloud only state that domains failing verification are suspended, without a day count. So 'unverified domains get held' is certain, 'on which day' is not — registrars run different schedules, and the safe move is to submit documents on registration day.",
          ],
        },
        {
          heading: "How to lift it and how long recovery takes",
          paragraphs: [
            "The path depends on the cause: for unverified or rejected verification, submit or resubmit documents in the registrar console; for approved-but-not-refreshed, wait; for an abuse ban, contact the registry. Recovery timelines by registrar: Tencent Cloud says 1–2 working days to return to OK after approval, and its verification article says normal resolution resumes within 48 hours; Alibaba Cloud describes a delay of about one working day; West.cn says usually the next day. Once the status is OK, DNS caches still need time to refresh, so the site does not come back instantly.",
          ],
        },
        {
          heading: "Knock-on effects: ICP filing and redemption",
          paragraphs: [
            "A domain in serverHold cannot resolve, and ICP filing requires a verified domain in normal status, so filing cannot proceed while the hold is on. More importantly, Alibaba Cloud's redemption doc states that domains without completed verification cannot be redeemed — an unverified domain that also expires loses its rescue window entirely. Whether serverHold itself leads to deletion is not addressed by any official doc; we mark it unverified.",
          ],
        },
      ],
      pitfalls: [
        "Filing a complaint with the registrar as if it were an outage: serverHold is a registry status and the registrar can only forward documents — the wrong target just adds delay",
        "Resubmitting documents repeatedly during the refresh window: there is a 1–2 working day gap between approval and the status update, and duplicates may reset your place in the queue",
        "Submitting an ICP filing while in serverHold: filing requires a verified domain in normal status and will be bounced",
        "Assuming you can verify after expiry and then redeem: unverified domains cannot be redeemed, so verify before the expiry date",
      ],
      faq: [
        { q: "What does serverHold mean?", a: "A 'resolution suspended' status set by the registry. While in serverHold, DNS does not resolve and website and email are down. For .cn the most common cause is failing to complete real-name verification; others are a rejected verification, an approved verification whose status has not yet refreshed, and an abuse ban by the registry." },
        { q: "How is serverHold different from clientHold?", a: "serverHold is set by the registry and cannot be lifted directly by the registrar; clientHold is set by the registrar. The symptom is the same, the party to contact differs — confirm the status in WHOIS first." },
        { q: "How long does it take to lift serverHold?", a: "After documents are approved, Tencent Cloud says the status generally returns to OK in 1–2 working days (another Tencent article says resolution resumes within 48 hours), Alibaba Cloud says about one working day, West.cn says usually the next day. DNS cache refresh adds more time." },
        { q: "Does serverHold lead to deletion?", a: "No official document addresses this directly, so we mark it unverified. What is certain: an unverified domain in serverHold cannot be redeemed after expiry (Alibaba Cloud), so complete verification before the expiry date." },
      ],
      sources: src("en", "tcServerHold", "aliServerHold", "westServerHold", "tcRealname", "aliRedeem", "miitNotice"),
      cta: { title: "Check what status your .cn is in right now", desc: "Exact check reads RDAP/WHOIS status and expiry directly, without spending AI quota.", button: "Check domain status" },
    },
  },

  "cn-icp-beian": {
    slug: "cn-icp-beian",
    kind: "compliance",
    updatedAt: "2026-09-04",
    keywords: ["ICP 备案", "备案", "接入商", "备案主体", "工信部", "ICP filing"],
    tlds: [CN_TLD],
    zh: {
      label: "ICP 备案与实名",
      title: "ICP 备案与域名实名认证的区别：备案主体、接入商与时限",
      metaDescription: "实名认证审域名持有者，ICP 备案审网站：两者的区别、顺序与时限。按 CNNIC FAQ、工信部备案管理办法与阿里云备案帮助整理：什么时候必须备案、备案主体与域名持有者要不要一致、接入商做什么、20 个工作日时限与 45 天到期要求。",
      intro: "「域名我已经实名了，为什么还要备案？」这是中文创业者最常混淆的两个概念。实名认证是注册局对域名持有者身份的核验，做完域名才能解析；ICP 备案是省通信管理局对「用这个域名开的网站」的登记，网站放在中国内地服务器上才需要。CNNIC FAQ 说得很直接：域名本身不需要备案，用域名做网站才需要。这篇指南把两者的对象、审核方、前后顺序、主体一致性要求与时限逐项拆开，全部引用官方原文。",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "两件事的对象与审核方不同",
          paragraphs: [
            "实名认证的对象是域名持有者，依据是 CNNIC《国家顶级域名注册实施细则》与工信部规范域名使用的通知，材料经注册商转交注册局审核，结果决定域名能否解析。ICP 备案的对象是网站（互联网信息服务），依据是工信部《非经营性互联网信息服务备案管理办法》，由服务器所在的接入服务商代为提交、省通信管理局审核，结果是一个「京/粤/沪 ICP 备 xxx 号」。CNNIC FAQ 第九条明确：网站备案不由 CNNIC 负责和审批，需要联系接入服务商或注册商，通过各省通信管理局完成。",
          ],
        },
        {
          heading: "什么时候必须备案",
          paragraphs: [
            "阿里云《不同场景下的 ICP 备案说明 FAQ》给出了判断标准：域名解析指向中国内地服务器并开通 Web 服务时，需要 ICP 备案；只买服务器不绑域名不需要；解析指向境外服务器（如中国香港）不需要 ICP 备案，但需完成公安联网备案。主域名已备案时，对应子域名无需再备案；如果主域名的备案号不是在当前云平台申请的，则需要办理接入备案。",
          ],
          bullets: [
            "内地服务器 + 域名开 Web 服务 → 必须 ICP 备案",
            "境外/香港服务器 → 不需 ICP 备案，需公安联网备案",
            "只有服务器没有域名 → 不需要",
            "主域名已备案 → 子域名不用再备；换接入商 → 办接入备案",
          ],
        },
        {
          heading: "先实名，再备案：主体必须一致",
          paragraphs: [
            "阿里云《准备与检查域名》要求备案前域名已完成实名认证，且域名实名信息与备案主体信息一致：个人域名对应个人备案，公司备案需要公司持有域名。域名持有者为个人、备案主体为公司的情况，阿里云《备案域名 FAQ》写明只在法定代表人、股东、主要负责人等特殊情形下、且部分省份允许——具体以所在省管局规则为准。实名信息修改后同步到工信部系统可能需要 2–3 天，改完不要立刻提交备案。",
            "此外，备案所用域名的注册商必须是工信部已批复的机构，域名后缀也必须获得工信部批复，否则无法在阿里云等平台完成备案；.cn、.com.cn 都在批复范围内，海外注册商注册的域名则需先确认注册商资质。",
          ],
        },
        {
          heading: "时限：20 个工作日与 45 天",
          paragraphs: [
            "工信部《非经营性互联网信息服务备案管理办法》第十二条规定：材料齐全的，省通信管理局应当在 20 个工作日内予以备案。这是法定上限，不是平均值；接入商初审、管局补正会额外占用时间。阿里云另有一条实务要求：用于备案的域名一般需距离到期日至少 45 天，各省管局要求可能不同——所以域名快到期时先续费再备案。",
          ],
        },
        {
          heading: "接入商做什么",
          paragraphs: [
            "接入商就是给你服务器的云厂商或 IDC。按备案管理办法，接入商负责核验主体材料并向省通信管理局提交，备案主体则是网站责任主体。备案完成后网站若迁到另一家云厂商，需要在新厂商办理「接入备案」，把接入信息更新到新的接入商，否则原接入商可能取消接入导致备案被注销。各省管局对个人备案能否用于经营性网站等细则不同，本文标记为未核实，以所在省规则为准。",
          ],
        },
      ],
      pitfalls: [
        "以为实名了就等于备案了：实名审的是域名持有者，备案审的是网站；内地服务器开站两者都要",
        "个人持有域名却想用公司备案：只有法定代表人/股东等特殊情形且部分省份允许，多数情况要先把域名过户给公司",
        "域名还剩一个月就去备案：阿里云要求距到期至少 45 天，先续费",
        "换了服务器不办接入备案：原接入商可能取消接入，备案号被注销后网站会被拦截",
      ],
      faq: [
        { q: "域名实名认证和 ICP 备案有什么区别？", a: "实名认证是注册局核验域名持有者身份，做完域名才能解析，材料经注册商转交注册局；ICP 备案是省通信管理局对网站的登记，由接入商代为提交，网站托管在中国内地服务器时才需要。CNNIC FAQ 明确：域名本身不需要备案，用域名做网站才需要。" },
        { q: ".cn 域名不备案能用吗？", a: "看服务器在哪。解析到中国内地服务器并开 Web 服务必须备案；解析到境外或中国香港服务器不需要 ICP 备案，但需完成公安联网备案（阿里云口径）。域名本身不需要备案。" },
        { q: "备案主体必须和域名持有者一致吗？", a: "是。阿里云要求域名实名信息与备案主体信息一致：个人域名对应个人备案，公司备案需公司持有域名。个人持有、公司备案只在法定代表人/股东等特殊情形且部分省份允许，以所在省管局规则为准。" },
        { q: "ICP 备案要多久？", a: "工信部备案管理办法规定材料齐全时省通信管理局 20 个工作日内予以备案，这是法定上限；接入商初审和补正材料会额外占时间。" },
      ],
      sources: src("zh", "cnnicFaq", "miitBeian", "aliBeianScenario", "aliBeianDomainPrep", "aliBeianDomainFaq", "miitNotice"),
      cta: { title: "备案前先确认域名归属与到期时间", desc: "精确核验读取 .cn 的注册状态与到期日期，判断是否满足距到期 45 天的备案要求。", button: "查 .cn 到期时间" },
    },
    en: {
      label: "ICP filing vs real-name",
      title: "ICP Filing vs Domain Real-Name Verification: Filing Entity, Access Provider and Timelines",
      metaDescription: "Real-name verification vets the holder, ICP filing vets the site: how they differ. Compiled from the CNNIC FAQ, MIIT filing measures and Alibaba Cloud filing docs: when filing is mandatory, whether the filing entity must match the domain holder, what the access provider does, the 20-working-day limit and the 45-days-to-expiry requirement.",
      intro: "'My domain is already verified — why do I need to file?' is the most common mix-up among Chinese founders. Real-name verification is the registry checking who holds the domain; without it the domain does not resolve. ICP filing is the provincial communications administration registering the website that uses the domain, and it is only required when the site is hosted on servers in mainland China. The CNNIC FAQ puts it bluntly: the domain itself needs no filing; a website built on it does. This guide separates the two by subject, reviewer, order, entity-matching rules and timelines, citing official text throughout.",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "Different subjects, different reviewers",
          paragraphs: [
            "Real-name verification targets the domain holder, is grounded in the CNNIC Implementing Rules and MIIT's notice on domain use, is forwarded by the registrar to the registry, and determines whether the domain resolves. ICP filing targets the website (an internet information service), is grounded in MIIT's Measures for the filing of non-commercial internet information services, is submitted by the hosting access provider and reviewed by the provincial communications administration, and yields a filing number such as '京ICP备xxx号'. CNNIC FAQ item 9 states that website filing is not handled or approved by CNNIC — you go through your access provider or registrar to the provincial administration.",
          ],
        },
        {
          heading: "When filing is mandatory",
          paragraphs: [
            "Alibaba Cloud's ICP filing scenarios FAQ sets the test: filing is required when the domain resolves to a mainland China server with web services enabled; buying a server without binding a domain needs none; resolving to an overseas server (e.g. Hong Kong) needs no ICP filing but does require public security network filing. Subdomains of an already-filed main domain need no separate filing; if the main domain's filing was obtained on another platform, an access filing is required.",
          ],
          bullets: [
            "Mainland server + domain serving web → ICP filing mandatory",
            "Overseas / Hong Kong server → no ICP filing, public security network filing required",
            "Server only, no domain → not required",
            "Main domain filed → subdomains covered; switching access provider → access filing",
          ],
        },
        {
          heading: "Verify first, then file: the entities must match",
          paragraphs: [
            "Alibaba Cloud's 'Prepare and check the domain' requires the domain to have completed real-name verification before filing, with the real-name data matching the filing entity: a personal domain files as an individual, a company filing needs the company to hold the domain. For an individual-held domain filed under a company, Alibaba Cloud's domain FAQ allows it only in special cases — legal representative, shareholder, principal officer — and only in some provinces; the provincial administration's rules govern. Updated real-name data can take 2–3 days to sync to MIIT, so do not file immediately after editing.",
            "The registrar of a filed domain must also be an MIIT-approved institution and the suffix must be MIIT-approved, otherwise filing cannot be completed on platforms like Alibaba Cloud. .cn and .com.cn are approved; for domains bought from overseas registrars, confirm the registrar's status first.",
          ],
        },
        {
          heading: "Timelines: 20 working days and 45 days",
          paragraphs: [
            "Article 12 of MIIT's filing measures states that, with complete materials, the provincial communications administration shall complete the filing within 20 working days. That is a statutory ceiling, not an average; the access provider's preliminary review and any correction requests add time. Alibaba Cloud adds a practical rule: a domain used for filing generally needs at least 45 days before expiry, and provincial requirements may differ — renew before filing if the domain is close to expiry.",
          ],
        },
        {
          heading: "What the access provider does",
          paragraphs: [
            "The access provider is the cloud vendor or IDC hosting your server. Under the filing measures it verifies the entity's materials and submits them to the provincial administration, while the filing entity is the party responsible for the site. If you later move the site to another cloud vendor, you must complete an 'access filing' there to update the access information, or the original provider may drop access and the filing may be cancelled. Provincial rules on matters such as whether an individual filing may serve a commercial site vary; we mark them unverified and defer to the local administration.",
          ],
        },
      ],
      pitfalls: [
        "Assuming verification equals filing: verification vets the domain holder, filing vets the website; a site on a mainland server needs both",
        "Filing a personally held domain under a company: only allowed for legal representatives/shareholders in some provinces — in most cases transfer the domain to the company first",
        "Filing with one month left on the domain: Alibaba Cloud requires at least 45 days to expiry — renew first",
        "Switching servers without an access filing: the original provider may cancel access and a cancelled filing gets the site blocked",
      ],
      faq: [
        { q: "What is the difference between real-name verification and ICP filing?", a: "Verification is the registry vetting the domain holder's identity, forwarded by the registrar; the domain will not resolve without it. ICP filing is the provincial communications administration registering the website, submitted by the access provider, and is only needed when the site is hosted in mainland China. The CNNIC FAQ states the domain itself needs no filing." },
        { q: "Can I use a .cn without ICP filing?", a: "It depends on where the server is. Resolving to a mainland China server with web services requires filing; resolving to an overseas or Hong Kong server requires no ICP filing but does require public security network filing (Alibaba Cloud). The domain itself never needs filing." },
        { q: "Must the filing entity match the domain holder?", a: "Yes. Alibaba Cloud requires the domain's real-name data to match the filing entity: personal domain, personal filing; company filing requires the company to hold the domain. Individual-held, company-filed is allowed only for legal representatives/shareholders in some provinces." },
        { q: "How long does ICP filing take?", a: "MIIT's filing measures require the provincial administration to complete the filing within 20 working days when materials are complete — a statutory ceiling. The access provider's preliminary review and correction rounds add time." },
      ],
      sources: src("en", "cnnicFaq", "miitBeian", "aliBeianScenario", "aliBeianDomainPrep", "aliBeianDomainFaq", "miitNotice"),
      cta: { title: "Confirm ownership and expiry before you file", desc: "Exact check reads the .cn's registration status and expiry date so you can verify the 45-days-to-expiry filing rule.", button: "Check .cn expiry" },
    },
  },

  "cn-dns-inland-vs-overseas": {
    slug: "cn-dns-inland-vs-overseas",
    kind: "compliance",
    updatedAt: "2026-09-04",
    keywords: ["境内解析", "境外解析", "香港服务器", "不备案", "DNS", "overseas hosting"],
    tlds: [CN_TLD],
    zh: {
      label: "境内 vs 境外解析",
      title: ".cn 解析到境内还是境外：备案边界与怎么选",
      metaDescription: ".cn 指向香港或海外服务器要不要备案？看服务器所在地，不看后缀。按阿里云备案 FAQ、CNNIC FAQ、工信部规定与海外注册商文档整理：境内/境外托管各自要做什么、实名与备案的边界、切换接入商的注意点与尚未核实的问题。",
      intro: "拿到 .cn 之后第二个决策是：网站放在中国内地还是香港/海外？很多人以为 .cn 后缀本身就要求备案，其实官方口径是「域名本身不需要备案」，需要备案的是解析到中国内地服务器并开通 Web 服务的网站。也就是说 .cn 完全可以指向香港或海外服务器而不做 ICP 备案，但实名认证无论解析到哪里都必须完成。这篇指南把两条路各自的合规清单、优缺点和不能省的步骤列出来，帮你在注册后立刻做对第一步。",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "决定备案义务的是服务器，不是后缀",
          paragraphs: [
            "阿里云《不同场景下的 ICP 备案说明 FAQ》的判断标准只有一条：域名解析指向中国内地服务器并开通 Web 服务时需要 ICP 备案；指向境外服务器（如中国香港）则无需 ICP 备案，但需完成公安联网备案。CNNIC FAQ 第九条从注册局角度说了同一件事：域名本身不需要备案，用域名建网站才依工信部要求备案。因此 .cn、.com.cn 与 .com 在这一点上没有区别——同一台香港服务器上，.cn 和 .com 都不需要 ICP 备案；同一台北京服务器上，两者都需要。",
          ],
        },
        {
          heading: "实名认证不分境内境外",
          paragraphs: [
            "无论解析到哪里，.cn 的实名认证都必须完成。工信部要求注册商不得为未提供真实身份信息的域名提供解析服务，这条针对的是域名注册环节，与服务器位置无关。海外注册商同样执行：WebNIC 的 .CN FAQ 要求注册后 7 天内提交护照或公司注册文件，否则删除退款，并提示域名在中国境内解析须提交 ICP 备案号。所以「放海外就不用实名」是误解，「放海外就不用备案」才是对的。",
          ],
        },
        {
          heading: "两条路线的合规清单",
          paragraphs: ["把两种托管方式各自要做的事并列，方便按需勾选："],
          bullets: [
            "境内托管：域名实名 → ICP 备案（接入商代提交，省管局 20 个工作日内审核）→ 公安联网备案 → 网站上线；备案期间域名需距到期 ≥45 天（阿里云口径）",
            "境外/香港托管：域名实名 → 公安联网备案（阿里云口径）→ 网站上线；无需 ICP 备案",
            "两者共同：实名信息与后续任何备案主体保持一致；域名到期前续费，避免 serverHold 与赎回",
          ],
        },
        {
          heading: "什么时候值得先放境外",
          paragraphs: [
            "对刚起步、还在验证想法的创业者，先把 .cn 指向香港或海外服务器可以跳过 20 个工作日的备案周期，快速上线落地页收集需求；等业务确定要服务内地用户、需要内地 CDN 或小程序等能力时再迁回境内并做首次备案。反过来，如果目标用户全在内地、对访问速度与合规展示（页脚备案号）敏感，一开始就走境内路线更省事。这是产品决策而非法规要求，两条路在法规上都成立。",
          ],
        },
        {
          heading: "切换与尚未核实的问题",
          paragraphs: [
            "从境外迁回境内需要做首次备案；已备案后换云厂商需要办接入备案，否则原接入商可能取消接入。两个常见问题本文无法给出官方答案，标记为未核实：一是境内 DNS 服务商是否强制要求域名已备案才允许添加解析记录，各家产品策略不同；二是各省管局对境外服务器公安联网备案的具体执行细节。遇到这两点请以所用云厂商与所在省的最新说明为准。",
          ],
        },
      ],
      pitfalls: [
        "以为 .cn 后缀本身就必须备案：备案看服务器所在地，域名本身不需要备案",
        "以为放海外就可以不实名：实名是注册环节的要求，与服务器位置无关，海外注册商同样要求提交证件",
        "境外托管就什么登记都不做：阿里云口径下仍需完成公安联网备案",
        "迁回境内时没预留备案周期：省管局法定时限是 20 个工作日，加上接入商初审与补正，排期至少留一个月",
      ],
      faq: [
        { q: ".cn 域名解析到香港服务器要备案吗？", a: "不需要 ICP 备案。阿里云备案 FAQ 明确：解析指向境外服务器（如中国香港）无需 ICP 备案，但需完成公安联网备案。域名实名认证仍然必须完成。" },
        { q: "域名不备案能用吗？", a: "域名本身不需要备案（CNNIC FAQ）。只要不解析到中国内地服务器开 Web 服务，就不触发 ICP 备案；一旦指向内地服务器建站，就必须备案。" },
        { q: "境外解析可以不做实名认证吗？", a: "不可以。实名是域名注册环节的要求，工信部规定注册商不得为未提供真实身份信息的域名提供解析，与服务器在哪无关。" },
        { q: "境内 DNS 服务商会要求先备案才能解析吗？", a: "本文未核实——各家 DNS 产品策略不同，官方文档没有统一说法，请以所用云厂商的最新说明为准。" },
      ],
      sources: src("zh", "aliBeianScenario", "cnnicFaq", "miitNotice", "miitBeian", "aliBeianDomainFaq", "webnic"),
      cta: { title: "先确认 .cn 能注册，再决定放哪", desc: "精确核验实时查 .cn/.com.cn 注册状态，注册后再按本文清单选境内或境外路线。", button: "查 .cn 是否可注册" },
    },
    en: {
      label: "Inland vs overseas hosting",
      title: "Pointing a .cn Inland or Overseas: The Filing Boundary and How to Choose",
      metaDescription: "Does a .cn on an overseas server need ICP filing? The server location decides. Compiled from Alibaba Cloud's filing FAQ, the CNNIC FAQ, MIIT rules and an overseas registrar's docs: what each hosting route requires, where verification ends and filing begins, switching access providers, and open questions we could not verify.",
      intro: "The second decision after getting a .cn is where to host: mainland China or Hong Kong/overseas? Many assume the .cn suffix itself requires filing, but the official line is that the domain needs no filing — the website does, once it resolves to a mainland server with web services. A .cn can therefore point at a Hong Kong or overseas server without ICP filing, while real-name verification is mandatory regardless of where it resolves. This guide lays out the compliance checklist, trade-offs and non-skippable steps for each route so your first move after registration is the right one.",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "The server decides the filing duty, not the suffix",
          paragraphs: [
            "Alibaba Cloud's ICP filing scenarios FAQ has a single test: filing is required when the domain resolves to a mainland China server with web services enabled; pointing at an overseas server (e.g. Hong Kong) needs no ICP filing but does require public security network filing. CNNIC FAQ item 9 says the same from the registry side: the domain itself needs no filing; building a website on it does, per MIIT. On this point .cn, .com.cn and .com are identical — on the same Hong Kong server neither needs ICP filing; on the same Beijing server both do.",
          ],
        },
        {
          heading: "Verification applies everywhere",
          paragraphs: [
            "Wherever it resolves, a .cn must complete real-name verification. MIIT requires registrars not to resolve domains lacking real identity information; that rule attaches to registration, not to server location. Overseas registrars enforce it too: WebNIC's .CN FAQ requires a passport or company registration document within 7 days of registration or the domain is deleted and refunded, and notes that resolution inside China requires an ICP filing number. 'Host overseas and skip verification' is a misconception; 'host overseas and skip filing' is correct.",
          ],
        },
        {
          heading: "Compliance checklist for each route",
          paragraphs: ["The two hosting routes side by side, as a checklist:"],
          bullets: [
            "Mainland hosting: verify domain → ICP filing (submitted by access provider, provincial review within 20 working days) → public security network filing → go live; domain needs ≥45 days to expiry during filing (Alibaba Cloud)",
            "Overseas / Hong Kong hosting: verify domain → public security network filing (Alibaba Cloud) → go live; no ICP filing",
            "Both: keep real-name data consistent with any later filing entity; renew before expiry to avoid serverHold and redemption",
          ],
        },
        {
          heading: "When starting overseas makes sense",
          paragraphs: [
            "For founders still validating an idea, pointing the .cn at a Hong Kong or overseas server skips the 20-working-day filing cycle and gets a landing page live fast; once the business commits to mainland users and needs mainland CDN or mini-program capabilities, migrate inland and complete a first filing. Conversely, if all users are in the mainland and you care about latency and visible compliance (the filing number in the footer), going inland from day one is simpler. This is a product decision, not a legal one — both routes are lawful.",
          ],
        },
        {
          heading: "Switching, and what we could not verify",
          paragraphs: [
            "Moving from overseas to inland requires a first filing; changing cloud vendors after filing requires an access filing, or the original provider may drop access. Two common questions have no official answer we could find and are marked unverified: whether mainland DNS providers require a filed domain before allowing records to be added (policies differ by product), and how each province implements public security network filing for overseas servers. Defer to your cloud vendor's and province's current guidance on both.",
          ],
        },
      ],
      pitfalls: [
        "Assuming the .cn suffix itself requires filing: filing follows server location; the domain never needs filing",
        "Assuming overseas hosting means no verification: verification is a registration requirement independent of servers, and overseas registrars demand documents too",
        "Doing no registration at all when hosting overseas: under Alibaba Cloud's guidance public security network filing is still required",
        "Migrating inland without budgeting for filing: the statutory limit is 20 working days plus provider review and corrections — allow at least a month",
      ],
      faq: [
        { q: "Does a .cn pointed at a Hong Kong server need filing?", a: "No ICP filing. Alibaba Cloud's filing FAQ states that resolving to an overseas server such as Hong Kong requires no ICP filing but does require public security network filing. Real-name verification is still mandatory." },
        { q: "Can I use a domain without filing?", a: "The domain itself never needs filing (CNNIC FAQ). Filing is triggered only when the domain resolves to a mainland China server serving a website; the moment it points at a mainland server for a site, filing becomes mandatory." },
        { q: "Can I skip real-name verification if I host overseas?", a: "No. Verification is a registration-stage requirement; MIIT bars registrars from resolving domains without real identity information regardless of where the server is." },
        { q: "Do mainland DNS providers require filing before adding records?", a: "Unverified — policies differ by product and no official document gives a uniform answer. Follow your cloud vendor's current guidance." },
      ],
      sources: src("en", "aliBeianScenario", "cnnicFaq", "miitNotice", "miitBeian", "aliBeianDomainFaq", "webnic"),
      cta: { title: "Confirm the .cn is available, then decide where to host", desc: "Exact check queries .cn/.com.cn registration status live; register, then pick the inland or overseas route from this checklist.", button: "Check .cn availability" },
    },
  },

  "cn-vs-comcn-registrar": {
    slug: "cn-vs-comcn-registrar",
    kind: "compliance",
    updatedAt: "2026-09-04",
    keywords: ["com.cn", ".cn 还是 .com.cn", "注册商", "阿里云", "腾讯云", "西部数码", "海外注册商", "个人注册", "企业注册"],
    tlds: [CN_TLD],
    zh: {
      label: ".cn/.com.cn 与注册商",
      title: ".cn 还是 .com.cn、国内还是海外注册商：企业与个人怎么选",
      metaDescription: ".cn 还是 .com.cn、国内还是海外注册商、个人能否注册，一篇讲清。.cn 与 .com.cn 的官方定位差异、国内注册商（阿里云/腾讯云/西部数码）与海外注册商买 .cn 的流程差别、转移注册商的 CNNIC 规则：按工信部域名体系、CNNIC 细则与 FAQ、注册商官方帮助整理，未核实的价格与个别注册商政策明确标注。",
      intro: "选后缀和选注册商往往同时发生：.cn 还是 .com.cn？在阿里云、腾讯云、西部数码买，还是在海外注册商买？个人能不能注册？这篇指南只回答有官方依据的部分——工信部域名体系对 .com.cn 的定义、CNNIC 细则对注册主体的规定、CNNIC 对「必须通过认证注册服务机构办理」的要求、以及转移注册商的时限——并把海外注册商的特殊要求以 WebNIC 为例单独列出，不泛化为所有海外注册商的规则。价格随促销变化，本文不写具体数字，请看站内 /tld/cn 的实时价。",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: ".cn 与 .com.cn：定位不同，规则相同",
          paragraphs: [
            "工信部《中国互联网络域名体系》把 .CN 下的类别域名 COM 定义为「工、商、金融等企业」，也就是 .com.cn 从体系设计上是企业类别域名，.cn 则是顶级层面的通用注册。但两者同属 CNNIC 管理的国内域名，实名认证、serverHold、到期续费与赎回规则完全一致——腾讯云《域名续费相关》把 .cn、.com.cn、.net.cn、.中国 归为同一套「国内域名」规则。差别主要在品牌层面：.cn 更短、更贵、可注册的好名字更少；.com.cn 在企业官网中出现频率高、可读性强，同一个名字在 .cn 已被注册时往往还能拿到 .com.cn。想看两者与 .com 的直接对比，可以读站内的 .com vs .cn 对比页。",
          ],
        },
        {
          heading: "个人能不能注册",
          paragraphs: [
            "CNNIC《国家顶级域名注册实施细则》第十八条规定：除另有规定外，自然人、法人和非法人组织均可申请注册国家顶级域名。也就是个人可以注册 .cn，只是实名材料不同（个人用身份证，企业用营业执照等）。至于 .com.cn 这类企业类别域名，注册商实际是否接受个人注册，本文未逐家核实，请以注册商下单页的提示为准。需要提醒：个人持有的域名后续只能以个人身份备案，公司要备案就要先过户到公司名下（细则第二十五条要求信息变更 30 日内办理）。",
          ],
        },
        {
          heading: "国内注册商：流程一致，时限口径不同",
          paragraphs: ["CNNIC 明确最终用户须通过 CNNIC 认证的注册服务机构办理 .CN 的注册、变更、转让和续费。阿里云、腾讯云、西部数码都是认证注册商，注册流程都是「建实名信息模板 → 审核 → 注册时关联」，差异集中在实名审核时限的口径与控制台体验："],
          bullets: [
            "阿里云：信息模板审核通常 1 个工作日，部分 3–5 个工作日；.cn 续费宽限期 30 天、赎回期 14 天",
            "腾讯云：信息模板审核一般 1–3 个工作日；国内域名约 30 天宽限期、约 15 天赎回期",
            "西部数码：实名审核约 1–3 个工作日；描述 .cn 新注册有 5 天审核期，超期未实名进入 serverHold",
            "备案要求：注册商须为工信部批复机构，三家都满足；后缀 .cn/.com.cn 均已获批复",
          ],
        },
        {
          heading: "海外注册商买 .cn：以 WebNIC 为例",
          paragraphs: [
            "海外注册商同样必须是 CNNIC 认证机构，并执行同一套实名规则，但对持有者地址与材料有额外要求。以 WebNIC 的 .CN FAQ 为例：注册后 7 天内需提交护照或公司注册文件，否则删除并退款；持有者地址在中国的申请只能通过中国国内注册商办理；域名在中国境内解析须提交 ICP 备案号。生命周期方面 WebNIC 描述为约 30 天续费宽限、15 天赎回期、无等待删除期，到期后约 45 天重新开放注册。这是单家注册商的口径，其他海外注册商的政策需各自核实，本文不做泛化。",
          ],
        },
        {
          heading: "转移注册商的 CNNIC 规则",
          paragraphs: [
            "如果买错了地方或想集中管理，可以转移注册商。CNNIC 细则给了明确时限：距到期日不满 15 日的域名不得申请变更注册服务机构（第三十一条）；转出方验证持有者身份后应在 3 个工作日内发送转移密码（第三十三条）；转出方收到变更通知 5 个工作日内不答复的，CNNIC 可直接执行变更（第三十五条）。所以转移要在到期前至少两周启动，且转移期间不要让域名进入 serverHold。",
          ],
        },
      ],
      pitfalls: [
        "只看首年促销价选注册商：.cn 与 .com.cn 续费和赎回费才是长期成本，价格看站内实时价与注册商续费页",
        "个人先注册、公司再备案：实名主体与备案主体必须一致，多数情况要先过户，预留 30 日内变更手续",
        "中国地址在海外注册商下单：WebNIC 等明确不接受中国地址持有人，7 天内交不出材料会被删除退款",
        "到期前两周才想转移注册商：CNNIC 细则规定距到期不满 15 日不得转移",
      ],
      faq: [
        { q: "com.cn 和 cn 哪个好？", a: "规则层面完全一致（同属 CNNIC 国内域名，实名、serverHold、续费赎回规则相同）。工信部域名体系把 .com.cn 定义为「工、商、金融等企业」类别域名；.cn 更短、可注册的好名字更少。建议两者一起查、能注册就一起保护性注册。" },
        { q: "个人可以注册 .cn 域名吗？", a: "可以。CNNIC 细则第十八条规定自然人、法人和非法人组织均可申请注册国家顶级域名，个人用身份证实名。.com.cn 是否接受个人注册以注册商下单页为准（本文未逐家核实）。" },
        { q: "国外注册商可以注册 .cn 域名吗？", a: "可以，但必须是 CNNIC 认证注册商，且执行同一套实名规则。以 WebNIC 为例，注册后 7 天内要交护照/公司文件，中国地址持有人只能走国内注册商。其他海外注册商政策需各自核实。" },
        { q: "阿里云、腾讯云、西部数码买 .cn 有什么区别？", a: "都是 CNNIC 认证注册商，流程一致。区别在实名审核时限口径（阿里云通常 1 天/部分 3–5 工作日，腾讯云 1–3 工作日，西部数码约 1–3 工作日）与赎回期天数口径（阿里云 14 天、腾讯云约 15 天）。价格以各家实时页面为准。" },
      ],
      sources: src("zh", "miitDomainSystem", "cnnicRules", "cnnicRegistrar", "cnnicFaq", "aliRealname", "tcRealname", "tcRenew", "westRealname", "webnic"),
      cta: { title: "同时查 xxx.cn 和 xxx.com.cn 是否可注册", desc: "精确核验支持 .cn 与 .com.cn 等多级后缀，实时读取注册状态与到期时间。", button: "查 .cn / .com.cn" },
    },
    en: {
      label: ".cn/.com.cn & registrars",
      title: ".cn or .com.cn, Domestic or Overseas Registrar: How Companies and Individuals Should Choose",
      metaDescription: ".cn vs .com.cn, domestic vs overseas registrars, whether individuals can register. Official positioning of .cn vs .com.cn, how buying a .cn differs between domestic registrars (Alibaba Cloud, Tencent Cloud, West.cn) and overseas ones, and CNNIC's registrar-transfer rules — compiled from MIIT's domain system, the CNNIC rules and FAQ and official registrar help; unverified prices and individual registrar policies are flagged.",
      intro: "Choosing a suffix and a registrar usually happens at once: .cn or .com.cn? Alibaba Cloud, Tencent Cloud, West.cn, or an overseas registrar? Can an individual register? This guide answers only what official sources support — MIIT's definition of .com.cn, the CNNIC rules on who may register, CNNIC's requirement to go through accredited registrars, and transfer deadlines — and lists overseas-registrar specifics using WebNIC as one example, without generalizing to all overseas registrars. Prices change with promotions, so no figures here; see live pricing on /tld/cn.",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: ".cn vs .com.cn: different positioning, identical rules",
          paragraphs: [
            "MIIT's China internet domain name system defines the COM category under .CN as for 'industrial, commercial, financial and other enterprises' — .com.cn is by design an enterprise category domain, while .cn is general registration at the top level. Both are CNNIC domestic domains, so real-name verification, serverHold, renewal and redemption rules are identical; Tencent Cloud's renewal FAQ groups .cn, .com.cn, .net.cn and .中国 under one 'domestic domain' rule set. The difference is brand-level: .cn is shorter, pricier and has fewer good names left; .com.cn is common on corporate sites, reads clearly, and is often still available when the .cn is taken. For a direct comparison with .com, see our .com vs .cn page.",
          ],
        },
        {
          heading: "Can individuals register?",
          paragraphs: [
            "Article 18 of the CNNIC Implementing Rules states that, unless otherwise provided, natural persons, legal persons and unincorporated organizations may all apply to register national top-level domains. Individuals can register .cn; only the documents differ (ID card for individuals, business licence for companies). Whether registrars actually accept individual registrations for the enterprise-category .com.cn we did not verify registrar by registrar — follow the prompt on the registrar's order page. Note that a personally held domain can later be ICP-filed only as an individual; a company filing requires transferring the domain to the company first (Article 25 requires changes within 30 days).",
          ],
        },
        {
          heading: "Domestic registrars: same process, different quoted timelines",
          paragraphs: ["CNNIC requires end users to register, modify, transfer and renew .CN domains through CNNIC-accredited registrars. Alibaba Cloud, Tencent Cloud and West.cn are all accredited, and the flow is the same — create a real-name template → review → link at registration. Differences are in quoted verification timelines and console experience:"],
          bullets: [
            "Alibaba Cloud: template review usually 1 working day, sometimes 3–5; .cn renewal grace 30 days, redemption 14 days",
            "Tencent Cloud: template review generally 1–3 working days; domestic domains about 30 days grace, about 15 days redemption",
            "West.cn: verification about 1–3 working days; describes a 5-day review period after which an unverified .cn enters serverHold",
            "Filing eligibility: the registrar must be MIIT-approved — all three are; .cn and .com.cn are approved suffixes",
          ],
        },
        {
          heading: "Buying .cn from an overseas registrar: WebNIC as an example",
          paragraphs: [
            "Overseas registrars must likewise be CNNIC-accredited and enforce the same verification rules, but add requirements on holder address and documents. WebNIC's .CN FAQ, for example: passport or company registration documents within 7 days of registration or the domain is deleted and refunded; applicants with a China address may only register through a domestic Chinese registrar; resolution inside China requires an ICP filing number. On lifecycle, WebNIC describes roughly 30 days renewal grace, 15 days redemption, no pending-delete period, and re-release about 45 days after expiry. This is one registrar's policy; verify others individually — we do not generalize.",
          ],
        },
        {
          heading: "CNNIC rules for transferring registrars",
          paragraphs: [
            "If you bought in the wrong place or want to consolidate, you can transfer registrars. The CNNIC rules set clear deadlines: a domain within 15 days of expiry may not apply to change registrar (Article 31); the losing registrar must send the transfer code within 3 working days of verifying the holder (Article 33); if the losing registrar does not respond within 5 working days of the change notice, CNNIC may execute the change (Article 35). Start transfers at least two weeks before expiry and keep the domain out of serverHold meanwhile.",
          ],
        },
      ],
      pitfalls: [
        "Choosing a registrar on first-year promo price alone: renewal and redemption fees are the long-run cost — check live pricing on this site and the registrar's renewal page",
        "Registering personally, filing as a company later: real-name and filing entities must match, so most cases need a transfer first — budget for the 30-day change window",
        "Ordering from an overseas registrar with a China address: WebNIC and others reject China-address holders, and missing the 7-day document deadline means deletion and refund",
        "Starting a registrar transfer two weeks before expiry: CNNIC rules bar transfers within 15 days of expiry",
      ],
      faq: [
        { q: "Which is better, .com.cn or .cn?", a: "The rules are identical (both CNNIC domestic domains with the same verification, serverHold, renewal and redemption rules). MIIT defines .com.cn as the category for 'industrial, commercial, financial and other enterprises'; .cn is shorter with fewer good names left. Check both and register both defensively when available." },
        { q: "Can an individual register a .cn?", a: "Yes. Article 18 of the CNNIC rules allows natural persons, legal persons and unincorporated organizations to register national TLDs; individuals verify with an ID card. Whether .com.cn accepts individuals depends on the registrar's order page (not verified per registrar)." },
        { q: "Can an overseas registrar register .cn?", a: "Yes, provided it is CNNIC-accredited, and it enforces the same verification rules. WebNIC, for example, requires a passport or company documents within 7 days and routes China-address holders to domestic registrars. Other overseas registrars' policies must be checked individually." },
        { q: "How do Alibaba Cloud, Tencent Cloud and West.cn differ for .cn?", a: "All are CNNIC-accredited with the same flow. They differ in quoted verification timelines (Alibaba Cloud usually 1 day / sometimes 3–5 working days, Tencent Cloud 1–3, West.cn about 1–3) and quoted redemption windows (Alibaba Cloud 14 days, Tencent Cloud about 15). Prices per each registrar's live pages." },
      ],
      sources: src("en", "miitDomainSystem", "cnnicRules", "cnnicRegistrar", "cnnicFaq", "aliRealname", "tcRealname", "tcRenew", "westRealname", "webnic"),
      cta: { title: "Check xxx.cn and xxx.com.cn availability together", desc: "Exact check supports .cn, .com.cn and other multi-level suffixes and reads status and expiry live.", button: "Check .cn / .com.cn" },
    },
  },

  "cn-expiry-redemption": {
    slug: "cn-expiry-redemption",
    kind: "compliance",
    updatedAt: "2026-09-04",
    keywords: ["过期", "赎回期", "续费宽限期", "删除", "重新注册", "抢注", "redemption", "grace period"],
    tlds: [CN_TLD],
    zh: {
      label: ".cn 到期与赎回",
      title: ".cn 域名到期、续费宽限期与赎回期规则",
      metaDescription: ".cn 到期后 30 天宽限、约两周赎回、无等待删除期，一文讲清。过期后多久被删除、能不能赎回、什么时候可以重新注册：按 CNNIC 细则第五十一条与阿里云、腾讯云、WebNIC 官方文档整理 30 天续费确认期、约两周赎回期、无等待删除期的规则，未实名不能赎回等限制，以及监控捡漏的时间窗口。",
      intro: "对创业者来说，.cn 的到期规则有两面：一面是自己的域名千万不能过期——.cn 过了赎回期没有等待删除期，可能随时被删除并开放注册；另一面是别人的好域名可能在到期后约 45 天重新开放，是「捡漏」的窗口。这篇指南以 CNNIC 细则第五十一条为法规基线，把阿里云、腾讯云、WebNIC 三家对宽限期、赎回期、删除的执行口径并列，费用金额因随时变化不写具体数字。",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "法规基线：CNNIC 的 30 日续费确认期",
          paragraphs: [
            "CNNIC《国家顶级域名注册实施细则》第十六条规定域名注册有效期最长 10 年；第五十一条规定域名到期后自动进入 30 日的续费确认期，持有者在此期间未续费也未表示不续费的，注册服务机构应在期满之日注销该域名。CNNIC FAQ 也用同样表述提醒用户「每年域名到期日同申请日，到期后的 30 日为续费确认期」。这 30 天就是注册商控制台里「续费宽限期」的法规来源——期间域名仍归你，可以按原价续费。",
          ],
        },
        {
          heading: "注册商执行：宽限期、赎回期、删除",
          paragraphs: ["三家文档对 .cn 生命周期的描述基本一致，天数口径略有差异，以你所用注册商控制台显示为准："],
          bullets: [
            "阿里云：.cn 续费宽限期 30 天（原价续费）→ 赎回期 14 天（赎回手续费+1 年续费，到期时间延长 1 年）→ 等待删除期「随时删除」；不同平台状态可能有约 24 小时误差",
            "腾讯云：国内域名（.cn/.com.cn/.net.cn/.中国）约 30 天续费宽限期 → 约 15 天赎回期 → 错过后向公众开放注册；续费后解析 72 小时内恢复",
            "WebNIC（海外注册商示例）：约 30 天续费宽限 → 15 天赎回期 → 无等待删除期 → 到期日约 45 天后重新开放注册",
          ],
        },
        {
          heading: "赎回期的三个限制",
          paragraphs: [
            "赎回不是无条件的。阿里云《域名赎回》列出的限制：一是费用——赎回手续费加一年续费，赎回成功后到期时间延长一年；二是时间——.cn 赎回期只有约两周，错过后无法恢复；三是资格——未完成实名认证的域名无法赎回。第三条最容易被忽视：如果你的域名一直处于未实名的 serverHold 状态又过期了，就没有任何补救通道。赎回费具体金额各注册商不同且会调整，本文不写数字，请看控制台。",
          ],
        },
        {
          heading: "过期后多久能重新注册：捡漏窗口",
          paragraphs: [
            "把三家口径叠起来：到期日 + 30 天宽限 + 约 14–15 天赎回 ≈ 到期后 45 天，且 .cn 没有等待删除期，因此原持有者放弃的域名大约在到期 45 天后重新开放，WebNIC 直接写了「到期日期的大约 45 天后对公众重新注册」，阿里云写「随时删除」。注意这是近似值：注册商状态更新有约 24 小时误差，注册局删除批次时间不公开。想捡某个 .cn，正确做法是在精确核验里查它的到期日，从到期后第 40 天左右开始每天盯，而不是算到某一天才去看。",
          ],
        },
        {
          heading: "自己的域名怎么不踩坑",
          paragraphs: [
            "最省事的是一次注册多年（最长 10 年）并开自动续费；至少要在到期前 45 天完成续费——这也是阿里云对备案域名的到期要求。到期前 15 天内不能转移注册商（细则第三十一条），所以换注册商要更早。宽限期内续费是原价，进入赎回期就要付赎回费，两者可能相差数倍；而错过赎回期，域名可能被任何人注册，对已备案、已推广的品牌就是灾难。",
          ],
        },
      ],
      pitfalls: [
        "以为过期后还有几个月缓冲：.cn 宽限 30 天 + 赎回约两周后没有等待删除期，可能随时被删",
        "未实名的域名等到期再说：未实名无法赎回，到期即失",
        "把赎回期当成正常续费：赎回要付赎回手续费加 1 年续费，比宽限期内续费贵得多",
        "捡漏只算日子不盯状态：注册商状态有约 24 小时误差、注册局删除批次不公开，要每天查而不是算到某一天",
      ],
      faq: [
        { q: ".cn 域名过期多久可以重新注册？", a: "约到期后 45 天：30 天续费宽限期加约 14–15 天赎回期，.cn 没有等待删除期，之后可能随时删除并开放注册（阿里云写「随时删除」，WebNIC 写「到期约 45 天后重新开放」）。具体批次时间不公开，建议从到期后第 40 天起每天查。" },
        { q: ".cn 域名赎回期多少天？", a: "阿里云口径为 14 天，腾讯云与 WebNIC 口径为约 15 天，都在 30 天续费宽限期之后。赎回需支付赎回手续费加 1 年续费，成功后到期时间延长 1 年；未实名的域名无法赎回。" },
        { q: "续费宽限期是多久？", a: "CNNIC 细则第五十一条规定到期后 30 日为续费确认期，阿里云、腾讯云、WebNIC 均按 30 天执行，期间可按原价续费，域名仍归原持有者。" },
        { q: "赎回要多少钱？", a: "各注册商不同且会调整，本文不写具体数字。规则是赎回手续费加 1 年续费，赎回成功后到期时间延长 1 年，请以所用注册商控制台为准。" },
      ],
      sources: src("zh", "cnnicRules", "cnnicFaq", "aliRedeem", "tcRenew", "webnic"),
      cta: { title: "先查 xxx.cn 的到期时间，再决定续费或捡漏", desc: "精确核验实时读取 .cn 注册状态与到期日期，可加入监控在开放注册时提醒你。", button: "查 .cn 到期时间" },
    },
    en: {
      label: ".cn expiry & redemption",
      title: ".cn Expiry, Renewal Grace and Redemption Period Rules",
      metaDescription: "When an expired .cn is deleted, whether it can be redeemed and when it reopens. Compiled from Article 51 of the CNNIC rules and official Alibaba Cloud, Tencent Cloud and WebNIC docs: the 30-day renewal confirmation period, roughly two-week redemption, no pending-delete period, the no-redemption-without-verification rule, and the window for catching drops.",
      intro: "For founders, .cn expiry rules cut both ways. Your own domain must never lapse — after the redemption period a .cn has no pending-delete stage and may be deleted and released at any time. Other people's good domains, meanwhile, may reopen about 45 days after expiry, which is the window for catching drops. This guide takes Article 51 of the CNNIC rules as the legal baseline and lines up how Alibaba Cloud, Tencent Cloud and WebNIC implement grace, redemption and deletion; fee amounts change constantly and are not quoted.",
      namingIdeas: [],
      cases: [],
      sections: [
        {
          heading: "Legal baseline: CNNIC's 30-day renewal confirmation period",
          paragraphs: [
            "Article 16 of the CNNIC Implementing Rules caps registration terms at 10 years; Article 51 provides that an expired domain automatically enters a 30-day renewal confirmation period, and if the holder neither renews nor declares non-renewal, the registrar shall deregister the domain when the period ends. The CNNIC FAQ repeats it: 'the expiry date matches the application date each year, and the 30 days after expiry are the renewal confirmation period'. Those 30 days are the legal source of the 'renewal grace period' in registrar consoles — the domain is still yours and renews at the regular price.",
          ],
        },
        {
          heading: "Registrar implementation: grace, redemption, deletion",
          paragraphs: ["The three sources describe the .cn lifecycle consistently with slightly different day counts; your registrar's console is authoritative:"],
          bullets: [
            "Alibaba Cloud: .cn renewal grace 30 days (regular price) → redemption 14 days (redemption fee + 1-year renewal, expiry extended by one year) → pending-delete 'may be deleted at any time'; status across platforms may differ by about 24 hours",
            "Tencent Cloud: domestic domains (.cn/.com.cn/.net.cn/.中国) about 30 days grace → about 15 days redemption → released to the public afterwards; resolution resumes within 72 hours of renewal",
            "WebNIC (overseas registrar example): about 30 days grace → 15 days redemption → no pending-delete → re-released about 45 days after the expiry date",
          ],
        },
        {
          heading: "Three limits on redemption",
          paragraphs: [
            "Redemption is not unconditional. Alibaba Cloud's redemption doc lists: cost — a redemption fee plus one year's renewal, extending expiry by one year; time — the .cn redemption window is only about two weeks and cannot be recovered afterwards; eligibility — domains without completed real-name verification cannot be redeemed. The third is the one people miss: a domain that sat unverified in serverHold and then expired has no rescue path at all. Redemption fees vary by registrar and change, so no figures here — check the console.",
          ],
        },
        {
          heading: "When an expired .cn can be re-registered: the drop window",
          paragraphs: [
            "Stacking the three sources: expiry + 30 days grace + about 14–15 days redemption ≈ 45 days after expiry, and .cn has no pending-delete stage, so an abandoned domain reopens roughly 45 days after expiry — WebNIC states 'about 45 days after the expiry date', Alibaba Cloud says 'may be deleted at any time'. Treat it as approximate: registrar status can lag by about 24 hours and the registry's deletion batch times are not published. To catch a specific .cn, look up its expiry with exact check and watch daily from around day 40 after expiry rather than betting on one date.",
          ],
        },
        {
          heading: "Keeping your own domain safe",
          paragraphs: [
            "The easiest path is a multi-year term (up to 10 years) with auto-renew on; at minimum renew 45 days before expiry — also Alibaba Cloud's requirement for domains used in ICP filing. Registrar transfers are barred within 15 days of expiry (Article 31), so switch earlier. Renewal in the grace period is regular price; redemption adds a fee that can be several times higher; and missing redemption means anyone can register the domain — a disaster for a filed, promoted brand.",
          ],
        },
      ],
      pitfalls: [
        "Assuming months of buffer after expiry: 30 days grace plus about two weeks redemption, then no pending-delete — a .cn may be deleted at any time",
        "Leaving an unverified domain until expiry: unverified domains cannot be redeemed, so expiry is final",
        "Treating redemption as normal renewal: it adds a redemption fee on top of a year's renewal, far costlier than renewing in grace",
        "Counting days instead of watching status when catching a drop: registrar status lags about 24 hours and registry deletion batches are unpublished — check daily",
      ],
      faq: [
        { q: "How long after expiry can a .cn be re-registered?", a: "About 45 days after expiry: 30 days renewal grace plus about 14–15 days redemption, with no pending-delete stage, after which it may be deleted and released at any time (Alibaba Cloud: 'may be deleted at any time'; WebNIC: 'about 45 days after expiry'). Batch times are unpublished — check daily from day 40." },
        { q: "How long is the .cn redemption period?", a: "Alibaba Cloud says 14 days, Tencent Cloud and WebNIC say about 15 days, all after the 30-day grace period. Redemption costs a fee plus one year's renewal and extends expiry by one year; unverified domains cannot be redeemed." },
        { q: "How long is the renewal grace period?", a: "Article 51 of the CNNIC rules sets a 30-day renewal confirmation period after expiry; Alibaba Cloud, Tencent Cloud and WebNIC all implement 30 days, during which you renew at regular price and the domain remains yours." },
        { q: "How much does redemption cost?", a: "It varies by registrar and changes over time, so no figures here. The rule is a redemption fee plus one year's renewal, extending expiry by one year — check your registrar's console." },
      ],
      sources: src("en", "cnnicRules", "cnnicFaq", "aliRedeem", "tcRenew", "webnic"),
      cta: { title: "Check the expiry date of xxx.cn before renewing or waiting for the drop", desc: "Exact check reads .cn status and expiry live; add it to monitoring to be alerted when it reopens.", button: "Check .cn expiry" },
    },
  },
};
