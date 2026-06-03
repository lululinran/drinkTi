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
// 特调模板（硬编码，按维度差异分组）
const COCKTAIL_TEMPLATES = {
  same: [
    { name: "双倍回响", subtitle: "Double Echo", notes: "你们是同一种饮料的两次倒酒。彼此理解到几乎不需要解释,但也容易陷入同一种盲区。" },
  ],
  diff1: [
    { name: "微醺午后", subtitle: "Tipsy Afternoon", notes: "底味相似,只在一处微微不同。一个把另一个的浓烈稀释成入口的温度,另一个给松弛的对话添了一份分量。" },
    { name: "晨光蜂蜜", subtitle: "Morning Honey", notes: "醒来时窗帘缝里漏进的光,大致相同的频率,只是一个偏向蜂蜜的甜,另一个偏向柠檬的醒。" },
    { name: "桂花初雪", subtitle: "Osmanthus First Snow", notes: "你们像桂花和初雪,主体安静,香气低调。差异只在一处,但那一处恰好让组合不再单调。" },
  ],
  diff2: [
    { name: "凉茶情书", subtitle: "Cool Tea Love Letter", notes: "薄荷的清醒撞上抹茶的温柔,像两个时区的对话。表达方式完全不同,但要说的是同一件事。" },
    { name: "玫瑰乌龙", subtitle: "Rose Oolong", notes: "一个出香气,一个出底蕴。单喝都好,但放在一起才完整。彼此弥补对方少的那一面。" },
    { name: "霓虹苏打", subtitle: "Neon Soda", notes: "夜里那种亮色加冰块的视觉冲击。你们的差异是显性的,但正好相互衬托,谁也没盖过谁。" },
    { name: "雪顶咖啡", subtitle: "Affogato", notes: "一杯热的浓缩咖啡浇在冷冰淇淋上。瞬间的温差是一切发生的地方,化学反应快速但持久。" },
  ],
  diff3: [
    { name: "深夜电台", subtitle: "Midnight Radio", notes: "你们的频率本来不该重叠,但偏偏在深夜某个时刻接上了。听到对方的声音的瞬间,会觉得安静的世界变得有人陪。" },
    { name: "薄荷暴击", subtitle: "Mint Strike", notes: "一口下去,清凉直冲脑门。强烈的反差让对话从开始就停不下来,虽然累,但停不下来。" },
    { name: "月光奶昔", subtitle: "Moonlight Shake", notes: "看起来不应该混在一起的味道,搅一搅却出乎意料的顺。需要勇气,但一旦尝过就忘不掉。" },
  ],
  opposite: [
    { name: "极地烈焰", subtitle: "Polar Flame", notes: "你们站在彼此的对立面,饮料颜色都是相反的色环。在一起会有点折腾,但每次见面都能从对方身上看到自己缺失的那一半。" },
    { name: "无糖搭子", subtitle: "Sugar-free Pair", notes: "都讨厌甜腻,只是一个走向苦,一个走向辣。结合起来不浪漫,但稳。你们彼此都是对方生活里的清醒剂。" },
  ],
};

// 特殊配对（key 已按字母序排序，保证对称）
const SPECIAL_PAIRS = {
  "ENFP+INTJ": { name: "微醺午后", subtitle: "Tipsy Afternoon", notes: "桃子的甜香和威士忌的厚度,前调和余韵几乎来自两个世界。但当桃子需要重量,威士忌需要温度,这杯就出现了。" },
  "ESFJ+INTP": { name: "凉茶情书", subtitle: "Cool Tea Love Letter", notes: "金汤力的距离感遇上热红酒的拥抱,温度差异制造了奇妙的张力。一个负责思考,一个负责把所有人留住。" },
  "ENTJ+ISTJ": { name: "无糖搭子", subtitle: "Sugar-free Pair", notes: "黑咖啡和矿泉水。不浪漫,但稳。都讨厌甜腻和废话,搭档起来效率拉满。这是一杯不需要解释的组合。" },
  "ENTP+INFJ": { name: "深夜电台", subtitle: "Midnight Radio", notes: "莫吉托的折腾遇上热可可的安静。一个发射,一个接收。深夜时分对方都听得到,但说出口的不多。" },
};
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
// 双人特调生成（纯前端）— 基于维度差异的精简命名
// ============================================================

function generateCocktail(typeA, typeB) {
  // 排序保证 A+B 和 B+A 产生相同结果
  const sorted = [typeA, typeB].sort();
  const key = `${sorted[0]}+${sorted[1]}`;

  // 1. 精准匹配特殊组合
  if (SPECIAL_PAIRS[key]) {
    return { ...SPECIAL_PAIRS[key], compatibility: 88, typeA, typeB, drinkA: DRINKS[typeA], drinkB: DRINKS[typeB] };
  }

  // 2. 按维度差异选取模板
  const diff = countDimDiff(typeA, typeB);
  let pool, baseCompat;
  if (diff === 0)      { pool = COCKTAIL_TEMPLATES.same;     baseCompat = 96; }
  else if (diff === 1) { pool = COCKTAIL_TEMPLATES.diff1;    baseCompat = 86; }
  else if (diff === 2) { pool = COCKTAIL_TEMPLATES.diff2;    baseCompat = 75; }
  else if (diff === 3) { pool = COCKTAIL_TEMPLATES.diff3;    baseCompat = 62; }
  else                  { pool = COCKTAIL_TEMPLATES.opposite; baseCompat = 50; }

  const hash = hashStr(key) >>> 0;
  const tpl = pool[hash % pool.length];
  const jitter = (hash % 7) - 3;

  return {
    name: tpl.name,
    subtitle: tpl.subtitle,
    notes: tpl.notes,
    compatibility: Math.max(20, Math.min(99, baseCompat + jitter)),
    typeA, typeB,
    drinkA: DRINKS[typeA], drinkB: DRINKS[typeB],
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
