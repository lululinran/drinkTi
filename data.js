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
// 双人特调生成（纯前端）
// ============================================================
function generateCocktail(typeA, typeB) {
  const key = `${typeA}+${typeB}`;
  if (SPECIAL_PAIRS[key]) {
    const c = SPECIAL_PAIRS[key];
    return { ...c, compatibility: 88, typeA, typeB, drinkA: DRINKS[typeA], drinkB: DRINKS[typeB] };
  }
  const diff = countDimDiff(typeA, typeB);
  let pool, baseCompat;
  if (diff === 0)      { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.same)     || []; baseCompat = 96; }
  else if (diff === 1) { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.diff1)    || []; baseCompat = 86; }
  else if (diff === 2) { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.diff2)    || []; baseCompat = 75; }
  else if (diff === 3) { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.diff3)    || []; baseCompat = 62; }
  else                  { pool = (COCKTAIL_TEMPLATES && COCKTAIL_TEMPLATES.opposite) || []; baseCompat = 50; }
  if (!pool || pool.length === 0) {
    return { name: "特调", subtitle: "Mix", notes: "", compatibility: 50, typeA, typeB, drinkA: DRINKS[typeA], drinkB: DRINKS[typeB] };
  }
  const hash = hashStr(typeA + typeB) >>> 0;
  const tpl = pool[hash % pool.length];
  const jitter = (hash % 7) - 3;
  return {
    ...tpl,
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
