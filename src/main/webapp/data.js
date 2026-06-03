/* ============================================================
 * DrinkTi 数据层
 * 所有数据从后端数据库加载,前端仅做缓存和计算
 * ============================================================ */

// ---- 基础 API 工具 ----
const API_BASE = "/api";

async function apiGet(path) {
  const resp = await fetch(API_BASE + path, { credentials: "same-origin" });
  if (!resp.ok) throw new Error(`GET ${path} failed: ${resp.status}`);
  return resp.json();
}

async function apiPost(path, body) {
  const resp = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`POST ${path} failed: ${resp.status}`);
  return resp.json();
}

async function apiDelete(path) {
  const resp = await fetch(API_BASE + path, { method: "DELETE", credentials: "same-origin" });
  if (!resp.ok) throw new Error(`DELETE ${path} failed: ${resp.status}`);
  return resp.json();
}

// ---- 全局缓存 ----
let QUESTIONS = [];
let DRINKS = {};
let GLASS_SHAPES = {};
let COCKTAIL_TEMPLATES = null;
let SPECIAL_PAIRS = {};
let _refDataReady = false;

// 当前登录用户信息缓存
let _currentUser = null;

/**
 * 初始化：从后端加载所有参考数据
 */
async function initRefData() {
  if (_refDataReady) return;
  try {
    const resp = await apiGet("/reference-data");
    const d = (resp && resp.data) ? resp.data : resp;

    QUESTIONS = d.questions || [];

    DRINKS = d.drinks || {};
    for (const [mbti, drink] of Object.entries(DRINKS)) {
      GLASS_SHAPES[mbti] = drink.glassShape || "tall";
    }

    const rawTemplates = d.cocktailTemplates || [];
    COCKTAIL_TEMPLATES = {
      same:     rawTemplates.filter(t => t.diffGroup === "same"),
      diff1:    rawTemplates.filter(t => t.diffGroup === "diff1"),
      diff2:    rawTemplates.filter(t => t.diffGroup === "diff2"),
      diff3:    rawTemplates.filter(t => t.diffGroup === "diff3"),
      opposite: rawTemplates.filter(t => t.diffGroup === "opposite"),
    };

    const rawPairs = d.specialPairs || [];
    SPECIAL_PAIRS = {};
    rawPairs.forEach(sp => { SPECIAL_PAIRS[`${sp.typeA}+${sp.typeB}`] = sp; });

    _refDataReady = true;
    console.log("[DrinkTi] 参考数据加载完成:", QUESTIONS.length, "题,", Object.keys(DRINKS).length, "种饮料");
  } catch (err) {
    console.error("[DrinkTi] 参考数据加载失败:", err);
  }
}

// ============================================================
// MBTI 计算（纯前端）
// ============================================================
function calculateMBTI(answers) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  answers.forEach((opt) => {
    if (!opt || !opt.score) return;
    for (const [k, v] of Object.entries(opt.score)) {
      scores[k] = (scores[k] || 0) + v;
    }
  });
  const mbti =
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P");
  const pct = {
    EI: scores.E + scores.I > 0 ? Math.round((scores.E / (scores.E + scores.I)) * 100) : 50,
    SN: scores.S + scores.N > 0 ? Math.round((scores.S / (scores.S + scores.N)) * 100) : 50,
    TF: scores.T + scores.F > 0 ? Math.round((scores.T / (scores.T + scores.F)) * 100) : 50,
    JP: scores.J + scores.P > 0 ? Math.round((scores.J / (scores.J + scores.P)) * 100) : 50,
  };
  return { mbti, scores, pct };
}

// ============================================================
// 双人特调生成（纯前端）— 256对各有独有名称
// ============================================================

// 名称模式池（按差异度分组）
const NAME_PATTERNS = {
  same: [
    ["双倍{nameA}", "Double {enA}"],
    ["纯{nameA}", "Pure {enA}"],
    ["镜像{nameA}", "Mirror {enA}"],
    ["{nameA}²", "{enA} Squared"],
    ["双重{nameB}", "Twin {enB}"],
    ["{enA} on the Rocks", "{nameB}加冰"],
    ["经典{nameA}", "Classic {enA}"],
    ["深烘{enA}", "Dark Roast {enA}"],
    ["{enA} Neat", "{nameA}纯饮"],
    ["无糖{nameA}", "Unsweetened {enA}"],
    ["{enA} Essence", "{nameA}原味"],
    ["独享{nameA}", "Solo {enA}"],
    ["{enA} Reserve", "{nameA}典藏"],
    ["慢品{nameB}", "Slow Pour {enB}"],
    ["{enA} Spirit", "{nameB}灵魂"],
    ["至醇{nameA}", "Quintessence of {enA}"],
  ],
  diff1: [
    ["{enA} × {enB}", "{nameB}{nameA}特调"],
    ["微醺{enA}{enB}", "Tipsy {enA} & {enB}"],
    ["{nameB}遇见{nameA}", "{enA} Meets {enB}"],
    ["{enA} Fizz", "{nameA}气泡"],
    ["{enA} Smash", "{nameA}碎冰"],
    ["{enB} Sour", "{nameB}酸调"],
    ["{nameA}冰茶", "{enA} Iced Tea"],
    ["{enB} Breeze", "{nameB}微风"],
    ["蜜桃{enA}", "Peach {enA}"],
    ["{enA} Lemonade", "{nameA}柠檬水"],
    ["{enB} Ginger", "{nameB}姜汁"],
    ["{nameA}日出", "{enA} Sunrise"],
    ["{enB} Tonic", "{nameB}汤力"],
    ["{nameA}午后", "{enA} Afternoon"],
    ["{enB} Spritz", "{nameB}气泡酒"],
    ["{nameA}薄暮", "{enA} Twilight"],
    ["{enA} Collins", "{nameA}科林斯"],
    ["{enB} Cooler", "{nameB}酷乐"],
    ["{nameA}清风", "{enA} Gentle Breeze"],
    ["{enB} Mint", "{nameB}薄荷"],
    ["{nameA}日落", "{enA} Sunset"],
    ["{enB} Berry", "{nameB}莓果"],
    ["{nameA}雨林", "{enA} Rainforest"],
    ["{enB} Daisy", "{nameB}雏菊"],
    ["{nameA}晚霞", "{enA} Afterglow"],
    ["{enB} Velvet", "{nameB}丝绒"],
    ["{nameA}烟熏", "{enA} Smoked"],
    ["{enB} Bloom", "{nameB}花开"],
    ["{nameA}琥珀", "{enA} Amber"],
    ["{enB} Sparkle", "{nameB}闪亮"],
    ["{nameA}焦糖", "{enA} Caramel"],
    ["{enB} Mist", "{nameB}薄雾"],
  ],
  diff2: [
    ["霓虹{enA}", "Neon {enA}"],
    ["{enB}特调", "{enB} Special"],
    ["{nameA}与{nameB}", "{enA} & {enB}"],
    ["{enB}风味{enA}", "{enB}-infused {enA}"],
    ["{nameB}撞{nameA}", "{enB} vs {enA}"],
    ["午夜{enA}", "Midnight {enA}"],
    ["{enB}雪顶", "{enB} Affogato"],
    ["{nameA}之恋", "Love of {enA}"],
    ["{enB}玫瑰", "{enB} Rose"],
    ["{nameA}晨曦", "{enA} Dawn"],
    ["{enB}凉茶", "{enB} Cool Tea"],
    ["{nameA}情书", "{enA} Love Letter"],
    ["{enB}摩卡", "{enB} Mocha"],
    ["{nameA}协奏曲", "{enA} Concerto"],
    ["{enB}乌龙", "{enB} Oolong"],
    ["{nameA}变奏", "{enA} Variation"],
    ["{enB}奶盖", "{enB} Cream Top"],
    ["{nameA}苏打", "{enA} Soda"],
    ["{enB}晨光", "{enB} Morning Light"],
    ["{nameA}蜜语", "{enA} Honey Talk"],
    ["风中的{nameB}", "{enB} in the Wind"],
    ["{nameA}森林", "{enA} Forest"],
    ["盐系{enB}", "Salty {enB}"],
    ["{nameA}星夜", "{enA} Starry Night"],
    ["海盐{enB}", "Sea Salt {enB}"],
    ["{nameA}花园", "{enA} Garden"],
    ["椰林{enB}", "Coconut {enB}"],
    ["{nameA}浮云", "{enA} Cloud"],
    ["迷迭{enB}", "Rosemary {enB}"],
    ["{nameA}银河", "{enA} Galaxy"],
    ["甘露{enB}", "Nectar {enB}"],
    ["{nameA}极光", "{enA} Aurora"],
    ["{enB} Crush", "{nameB}碰撞"],
    ["{nameA}吟游", "{enA} Bard"],
    ["{enB} Dream", "{nameB}梦境"],
    ["{nameA}绯月", "{enA} Crimson Moon"],
    ["{enB} Echo", "{nameB}回响"],
    ["{nameA}雾凇", "{enA} Frost"],
    ["{enB} Whispers", "{nameB}低语"],
    ["{nameA}糖霜", "{enA} Frosting"],
    ["{enB} Mirage", "{nameB}幻象"],
    ["{nameA}落日", "{enA} Sundown"],
    ["{enB} Tempest", "{nameB}风暴"],
    ["{nameA}涟漪", "{enA} Ripple"],
    ["{enB} Horizon", "{nameB}地平线"],
    ["{nameA}余烬", "{enA} Ember"],
    ["{enB} Eclipse", "{nameB}日蚀"],
    ["{nameA}霜降", "{enA} Frostfall"],
  ],
  diff3: [
    ["深夜{enB}", "Late Night {enB}"],
    ["{enA}电台", "{enA} Radio"],
    ["{nameB}暴击", "{enB} Strike"],
    ["薄荷{enA}", "Mint {enA}"],
    ["{nameB}月夜", "{enB} Moonlit"],
    ["{enA}奶昔", "{enA} Shake"],
    ["冰火{enB}", "Fire & Ice {enB}"],
    ["{nameA}烈焰", "{enA} Flame"],
    ["{enB}极光", "{enB} Aurora"],
    ["{nameA}飓风", "{enA} Hurricane"],
    ["闪电{enB}", "Lightning {enB}"],
    ["{nameA}熔岩", "{enA} Lava"],
    ["雷暴{enB}", "Thunder {enB}"],
    ["{nameA}寒霜", "{enA} Frostbite"],
    ["火山{enB}", "Volcano {enB}"],
    ["{nameA}潮汐", "{enA} Tide"],
    ["{enB} Tornado", "{nameB}龙卷"],
    ["{nameA}地震", "{enA} Quake"],
    ["{enB} Blizzard", "{nameB}暴雪"],
    ["{nameA}海啸", "{enA} Tsunami"],
    ["{enB} Cyclone", "{nameB}旋风"],
    ["{nameA}岩浆", "{enA} Magma"],
    ["{enB} Thunderbolt", "{nameB}霹雳"],
    ["{nameA}沙暴", "{enA} Sandstorm"],
    ["{enB} Avalanche", "{nameB}雪崩"],
    ["{nameA}流星", "{enA} Meteor"],
    ["{enB} Inferno", "{nameB}炼狱"],
    ["{nameA}冰川", "{enA} Glacier"],
    ["{enB} Typhoon", "{nameB}台风"],
    ["{nameA}彗星", "{enA} Comet"],
    ["{enB} Vortex", "{nameB}漩涡"],
    ["{nameA}极寒", "{enA} Subzero"],
  ],
  opposite: [
    ["极地烈焰", "Polar Flame"],
    ["无糖搭子", "Sugar-free Pair"],
    ["冰与火之歌", "Song of Ice & Fire"],
    ["{enA} vs {enB}", "{nameA}对{nameB}"],
    ["昼夜交替", "Day & Night"],
    ["两极", "Two Poles"],
    ["{enA} Paradox", "{nameA}悖论"],
    ["阴阳特调", "Yin Yang Mix"],
    ["{enA} Collision", "{nameA}碰撞"],
    ["对立统一", "Unity of Opposites"],
    ["{enA} Duality", "{nameA}二元"],
    ["正反合", "Thesis Antithesis"],
    ["{enA} Contrast", "{nameA}反差"],
    ["南北极", "North & South"],
    ["{enA} Fusion", "{nameA}融合"],
    ["矛盾螺旋", "Spiral of Contradiction"],
  ],
};

// 格式化名称中的占位符（自动去"型"后缀）
function formatName(pattern, a, b) {
  const na = (a.name || "").replace(/型$/, "").replace(/品$/, "");
  const nb = (b.name || "").replace(/型$/, "").replace(/品$/, "");
  return pattern
    .replace(/\{nameA\}/g, na)
    .replace(/\{nameB\}/g, nb)
    .replace(/\{enA\}/g, a.en)
    .replace(/\{enB\}/g, b.en);
}

// 根据差异度和哈希值选取名称（中文 + 英文）
function pickName(diff, hash) {
  const pool = NAME_PATTERNS[diff] || NAME_PATTERNS["diff3"];
  return pool[hash % pool.length];
}

function generateCocktail(typeA, typeB) {
  // 排序保证 A+B 和 B+A 产生相同结果
  const sorted = [typeA, typeB].sort();
  const key = `${sorted[0]}+${sorted[1]}`;
  const drinkA = DRINKS[typeA];
  const drinkB = DRINKS[typeB];
  const hash = hashStr(key) >>> 0;
  const diff = countDimDiff(typeA, typeB);
  let diffKey = diff === 0 ? "same" : diff === 1 ? "diff1" : diff === 2 ? "diff2" : diff === 3 ? "diff3" : "opposite";

  // 特殊配对（有自定义笔记的）
  const special = SPECIAL_PAIRS[key] || null;

  // 选取模板（用于 notes）
  let pool, baseCompat;
  if (diff === 0)      { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.same)     || []; baseCompat = 96; }
  else if (diff === 1) { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.diff1)    || []; baseCompat = 86; }
  else if (diff === 2) { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.diff2)    || []; baseCompat = 75; }
  else if (diff === 3) { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.diff3)    || []; baseCompat = 62; }
  else                  { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.opposite) || []; baseCompat = 50; }
  const tpl = (pool && pool.length > 0) ? pool[hash % pool.length] : null;

  // 生成独有名称（特殊配对用精选名称）
  let cnName, enName;
  if (special) {
    cnName = special.name;
    enName = special.subtitle;
  } else {
    const namePair = pickName(diffKey, hash);
    cnName = formatName(namePair[0], drinkA, drinkB);
    enName = formatName(namePair[1], drinkA, drinkB);
  }

  const jitter = (hash % 7) - 3;
  const compat = Math.max(20, Math.min(99, baseCompat + jitter));
  const notes = special ? special.notes : (tpl ? tpl.notes : "");

  return {
    name: cnName,
    subtitle: enName,
    notes,
    compatibility: compat,
    typeA, typeB,
    drinkA, drinkB,
  };
}

function countDimDiff(a, b) {
  let n = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) n++;
  return n;
}

function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return h;
}

// ============================================================
// 调酒师等级
// ============================================================
function bartenderLevel(cocktailCount) {
  if (cocktailCount >= 16) return { lv: 5, name: "调酒大师", next: null };
  if (cocktailCount >= 13) return { lv: 5, name: "调酒大师", next: 16 };
  if (cocktailCount >= 8)  return { lv: 4, name: "金牌调酒师", next: 13 };
  if (cocktailCount >= 5)  return { lv: 3, name: "熟练调酒师", next: 8 };
  if (cocktailCount >= 2)  return { lv: 2, name: "初级调酒师", next: 5 };
  return { lv: 1, name: "新手调酒师", next: 2 };
}

// ============================================================
// 人格码 编码/解码 （V2: 包含 userId）
// 格式: DRK-{mbti}-U{base36_userId}-{random}   (登录用户)
//       DRK-{mbti}-{random}                     (未登录/旧格式)
// ============================================================
function _uidToBase36(uid) {
  return uid.toString(36).toUpperCase();
}

function _uidFromBase36(s) {
  return parseInt(s, 36);
}

function generateCode(mbti) {
  const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "X3F9";
  if (_currentUser && _currentUser.id) {
    return `DRK-${mbti}-U${_uidToBase36(_currentUser.id)}-${suffix}`;
  }
  return `DRK-${mbti}-${suffix}`;
}

/**
 * 解析人格码，返回 { mbti, userId|null }
 */
function parseCode(raw) {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, "");

  // 尝试新版格式: DRK-{mbti}-U{userId}-{random}
  const newMatch = cleaned.match(/^(?:DRK[-_]?)?([IE][SN][TF][JP])-U([0-9A-Z]+)-?/);
  if (newMatch && DRINKS[newMatch[1]]) {
    const mbti = newMatch[1];
    const userId = _uidFromBase36(newMatch[2]);
    return { mbti, userId: isNaN(userId) ? null : userId };
  }

  // 旧版格式: DRK-{mbti}-{random}
  const oldMatch = cleaned.match(/(?:DRK[-_]?)?([IE][SN][TF][JP])/);
  if (oldMatch && DRINKS[oldMatch[1]]) {
    return { mbti: oldMatch[1], userId: null };
  }
  return null;
}

// 兼容旧代码：只返回 MBTI 字符串
function parseCodeMBTI(raw) {
  const result = parseCode(raw);
  return result ? result.mbti : null;
}

// ============================================================
// 后端数据读写
// ============================================================
const DataAPI = {
  // 获取当前登录用户
  async getCurrentUser() {
    try {
      const resp = await apiGet("/auth/me");
      if (resp.loggedIn && resp.user) {
        _currentUser = resp.user;
        return resp.user;
      }
    } catch (e) { /* 未登录 */ }
    _currentUser = null;
    return null;
  },

  // 管理员统计
  async getAdminStats() {
    const resp = await apiGet("/admin/stats");
    return resp;
  },

  // 管理员详细数据
  async getAdminDetail() {
    const resp = await apiGet("/admin/detail");
    return resp;
  },

  // 登录
  async login(username, password) {
    const resp = await apiPost("/auth/login", { username, password });
    if (resp.success) {
      _currentUser = resp.user;
    }
    return resp;
  },

  // 注册
  async register(username, password, nickname) {
    const resp = await apiPost("/auth/register", { username, password, nickname });
    if (resp.success) {
      _currentUser = resp.user;
    }
    return resp;
  },

  // 退出登录
  async logout() {
    await apiGet("/auth/logout");
    _currentUser = null;
  },

  // 保存测试结果（需要登录）
  async saveResult(result) {
    const body = {
      mbti: result.mbti,
      drinkName: result.drink ? result.drink.name : "",
      timestamp: Date.now(),
      scores: result.scores,
      date: new Date().toISOString().split("T")[0],
      no: result.no,
    };
    const resp = await apiPost("/results", body);
    return resp;
  },

  // 获取最近一次结果
  async getLastResult() {
    try {
      const data = await apiGet("/results?latest=true");
      if (!data) return null;
      return {
        mbti: data.mbti,
        drink: DRINKS[data.mbti],
        scores: typeof data.scoresJson === "string" ? JSON.parse(data.scoresJson) : data.scoresJson,
        pct: null,
        testedAt: new Date(data.timestamp).toISOString(),
        no: data.no,
      };
    } catch (e) {
      if (e.message.includes("401")) return null;
      throw e;
    }
  },

  // 饮品柜收集统计
  async getCabinet() {
    return apiGet("/collection");
  },

  // 特调记录列表
  async getCocktails() {
    return apiGet("/cocktails");
  },

  // 特调详情
  async getCocktailDetail(id) {
    return apiGet(`/cocktails?id=${id}`);
  },

  // 保存特调记录
  async saveCocktail(c, partnerUserId) {
    const body = {
      typeA: c.typeA,
      typeB: c.typeB,
      drinkNameA: c.drinkA ? c.drinkA.name : "",
      drinkNameB: c.drinkB ? c.drinkB.name : "",
      cocktailName: c.name || "",
      cocktailSubtitle: c.subtitle || "",
      notes: c.notes || "",
      compatibility: c.compatibility || 50,
    };
    if (partnerUserId) {
      body.partnerUserId = partnerUserId;
    }
    return apiPost("/cocktails", body);
  },

  // 清空全部数据
  async clearAll() {
    return apiDelete("/results");
  },
};
