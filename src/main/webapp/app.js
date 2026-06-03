/* ============================================================
 * DrinkTi 应用逻辑
 * 视图切换 · 答题流程 · 饮料 SVG · 特调合成
 * ============================================================ */

/* ============================================================
 * 一、状态管理 & 工具
 * ============================================================ */
const State = {
  currentQ: 0,
  answers: [],
};

function $(sel)    { return document.querySelector(sel); }
function $$(sel)   { return [...document.querySelectorAll(sel)]; }

function toast(msg, ms = 2200) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), ms);
}

/* ============================================================
 * 二、视图导航
 * ============================================================ */
async function navigateTo(view) {
  if (!_refDataReady) {
    await initRefData();
  }

  // 进入个人页面前刷新用户状态
  if (view === "profile" || view === "test" || view === "cabinet" || view === "cocktail") {
    await DataAPI.getCurrentUser();
  }

  // 答题前强制登录
  if (view === "test" && !_currentUser) {
    toast("请先登录或注册，才能开始测试");
    navigateTo("profile");
    return;
  }

  $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === view));
  $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.nav === view));
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (view === "test")     initTest();
  if (view === "cabinet")  await renderCabinet();
  if (view === "cocktail") await initCocktailPage();
  if (view === "profile")  await renderProfile();
  if (view === "result")   await renderResult();
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-nav]");
  if (!t) return;
  e.preventDefault();
  navigateTo(t.dataset.nav);
});

/* ============================================================
 * 三、饮料 SVG 渲染
 * ============================================================ */
function renderDrinkSVG(type, opt = {}) {
  const drink = DRINKS[type];
  if (!drink) return "";
  const color = drink.color;
  const dark = shade(color, -0.2);
  const light = shade(color, 0.25);
  const shape = GLASS_SHAPES[type] || "tall";

  const VB = "0 0 200 240";

  const shapes = {
    rocks: `
      <path d="M 55 80 L 60 200 Q 60 220 100 220 Q 140 220 140 200 L 145 80 Z"
            fill="none" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="clip-${type}"><path d="M 57 82 L 62 198 Q 62 218 100 218 Q 138 218 138 198 L 143 82 Z"/></clipPath>
      <g clip-path="url(#clip-${type})">
        <rect x="50" y="120" width="100" height="120" fill="${color}"/>
        <ellipse cx="100" cy="120" rx="44" ry="6" fill="${light}" opacity="0.7"/>
        <rect x="78" y="135" width="22" height="22" fill="#FFF" opacity="0.45" rx="3" transform="rotate(12 89 146)"/>
        <rect x="105" y="155" width="20" height="20" fill="#FFF" opacity="0.4" rx="3" transform="rotate(-8 115 165)"/>
      </g>`,
    tall: `
      <path d="M 70 30 L 65 200 Q 65 220 100 220 Q 135 220 135 200 L 130 30 Z"
            fill="none" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="clip-${type}"><path d="M 72 32 L 67 198 Q 67 218 100 218 Q 133 218 133 198 L 128 32 Z"/></clipPath>
      <g clip-path="url(#clip-${type})">
        <rect x="60" y="80" width="80" height="160" fill="${color}"/>
        <ellipse cx="100" cy="80" rx="32" ry="5" fill="${light}" opacity="0.75"/>
        <circle cx="85"  cy="160" r="3" fill="#FFF" opacity="0.6"/>
        <circle cx="110" cy="180" r="2.5" fill="#FFF" opacity="0.5"/>
        <circle cx="95"  cy="200" r="2"   fill="#FFF" opacity="0.4"/>
      </g>
      <line x1="115" y1="20" x2="105" y2="200" stroke="${dark}" stroke-width="3" stroke-linecap="round" opacity="0.85"/>`,
    mug: `
      <path d="M 60 70 L 60 200 Q 60 220 100 220 Q 140 220 140 200 L 140 70 Z"
            fill="none" stroke="#3D2A1F" stroke-width="2.5"/>
      <path d="M 140 90 Q 175 95 175 135 Q 175 175 140 180" fill="none" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="clip-${type}"><path d="M 62 72 L 62 198 Q 62 218 100 218 Q 138 218 138 198 L 138 72 Z"/></clipPath>
      <g clip-path="url(#clip-${type})">
        <rect x="55" y="100" width="90" height="120" fill="${color}"/>
        <ellipse cx="100" cy="100" rx="38" ry="5" fill="${light}" opacity="0.8"/>
        <ellipse cx="100" cy="98" rx="14" ry="3" fill="#F8EBD8" opacity="0.85"/>
      </g>
      <path d="M 90 50 Q 95 35 88 20" fill="none" stroke="${dark}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M 110 50 Q 105 35 112 20" fill="none" stroke="${dark}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>`,
    martini: `
      <path d="M 45 50 L 100 145 L 155 50 Z" fill="none" stroke="#3D2A1F" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="100" y1="145" x2="100" y2="200" stroke="#3D2A1F" stroke-width="2.5"/>
      <line x1="70" y1="220" x2="130" y2="220" stroke="#3D2A1F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="100" y1="200" x2="100" y2="220" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="clip-${type}"><path d="M 47 52 L 100 143 L 153 52 Z"/></clipPath>
      <g clip-path="url(#clip-${type})">
        <rect x="40" y="60" width="120" height="100" fill="${color}"/>
      </g>
      <circle cx="125" cy="62" r="6" fill="${dark}"/>
      <line x1="125" y1="62" x2="155" y2="40" stroke="${dark}" stroke-width="1.5"/>`,
    shot: `
      <path d="M 75 100 L 75 200 Q 75 220 100 220 Q 125 220 125 200 L 125 100 Z"
            fill="none" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="clip-${type}"><path d="M 77 102 L 77 198 Q 77 218 100 218 Q 123 218 123 198 L 123 102 Z"/></clipPath>
      <g clip-path="url(#clip-${type})">
        <rect x="70" y="120" width="60" height="100" fill="${color}"/>
        <ellipse cx="100" cy="120" rx="23" ry="4" fill="${light}" opacity="0.8"/>
      </g>
      <circle cx="125" cy="100" r="10" fill="#F2D060" stroke="${dark}" stroke-width="1.5"/>
      <line x1="120" y1="95" x2="130" y2="105" stroke="${dark}" stroke-width="1"/>`,
    coconut: `
      <ellipse cx="100" cy="140" rx="60" ry="70" fill="${color}" stroke="#3D2A1F" stroke-width="2.5"/>
      <ellipse cx="100" cy="100" rx="35" ry="8" fill="${dark}" opacity="0.6"/>
      <ellipse cx="100" cy="100" rx="32" ry="6" fill="${light}" opacity="0.85"/>
      <line x1="115" y1="55" x2="100" y2="100" stroke="#E89B7A" stroke-width="3" stroke-linecap="round"/>
      <path d="M 80 75 Q 65 60 55 50 Q 70 60 80 75 Z" fill="${dark}" opacity="0.5"/>`,
  };

  return `<svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${shapes[shape]}</svg>`;
}

function shade(hex, amt) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const adj = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? 255 - v : v) * amt)));
  return `rgb(${adj(r)}, ${adj(g)}, ${adj(b)})`;
}

/* ============================================================
 * 四、测试答题流程
 * ============================================================ */
function initTest() {
  State.currentQ = 0;
  State.answers = new Array(QUESTIONS.length).fill(null);
  renderQuestion();
}

function renderQuestion() {
  const idx = State.currentQ;
  const q = QUESTIONS[idx];
  if (!q) return;

  $("#progNum").textContent = idx + 1;
  $("#progFill").style.width = `${((idx + 1) / QUESTIONS.length) * 100}%`;

  const letters = ["A", "B", "C", "D"];
  const card = $("#testCard");
  card.innerHTML = `
    <div class="q-tag">Q${String(idx + 1).padStart(2, "0")} / ${QUESTIONS.length}</div>
    <h2 class="q-title">${q.question}</h2>
    <p class="q-sub">${q.subtitle || ""}</p>
    <div class="option-grid">
      ${q.options
        .map((o, i) => `
        <button class="option" data-idx="${i}">
          <span class="option-letter">${letters[i]}</span>
          <span class="option-body">
            <div class="option-text">${o.text}</div>
            <div class="option-desc">${o.desc}</div>
          </span>
        </button>`)
        .join("")}
    </div>`;

  const prev = State.answers[idx];
  if (prev) {
    const prevIdx = q.options.findIndex((o) => o.text === prev.text);
    if (prevIdx >= 0) card.querySelectorAll(".option")[prevIdx].classList.add("selected");
  }

  card.querySelectorAll(".option").forEach((btn) => {
    btn.addEventListener("click", () => {
      card.querySelectorAll(".option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      State.answers[idx] = q.options[+btn.dataset.idx];
      $("#btnNext").disabled = false;
    });
  });

  $("#btnPrev").disabled = idx === 0;
  $("#btnNext").disabled = !State.answers[idx];
  $("#btnNext").textContent = idx === QUESTIONS.length - 1 ? "调出我的饮料 →" : "下一题 →";
}

function nextQuestion() {
  if (!State.answers[State.currentQ]) return;
  if (State.currentQ === QUESTIONS.length - 1) {
    finishTest();
  } else {
    State.currentQ++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (State.currentQ === 0) return;
  State.currentQ--;
  renderQuestion();
}

async function finishTest() {
  const { mbti, scores, pct } = calculateMBTI(State.answers);
  const result = {
    mbti,
    scores,
    pct,
    drink: DRINKS[mbti],
    testedAt: new Date().toISOString(),
    no: String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0"),
  };
  try {
    await DataAPI.saveResult(result);
    navigateTo("result");
  } catch (e) {
    toast("保存失败，请检查网络或重新登录");
  }
}

/* ============================================================
 * 五、结果展示
 * ============================================================ */
async function renderResult() {
  const result = await DataAPI.getLastResult();
  const wrap = $("#resultWrap");
  if (!result || !result.drink) {
    wrap.innerHTML = `
      <div class="empty-state" style="text-align:center; padding:80px 20px;">
        <h2 class="page-title">还没有测试结果</h2>
        <p class="page-sub" style="margin-bottom:24px;">先登录并完成一次测试，这里就会出现你的饮料人格。</p>
        <button class="btn btn-primary" data-nav="test">开始测试 →</button>
      </div>`;
    return;
  }
  const { mbti, drink, pct, no } = result;
  const displayPct = pct || computePctFromScores(result.scores);
  const code = generateCode(mbti);

  wrap.innerHTML = `
    <div class="result-card">
      <div class="result-visual">
        <div class="result-no">no.${no || "0000"}</div>
        <div class="result-glass-wrap">
          <div class="result-glass">${renderDrinkSVG(mbti)}</div>
        </div>
      </div>
      <div class="result-info">
        <div class="result-eyebrow">— Your Drink Personality</div>
        <h1 class="result-name">${drink.name}</h1>
        <div class="result-en">${drink.en} · ${mbti}</div>
        <div class="result-slogan">${drink.slogan}</div>
        <div class="result-tags">${(drink.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <p class="result-desc">${drink.description}</p>

        <div class="dimension-bars">
          ${dimBarHtml("外向 E", "内向 I", displayPct.EI)}
          ${dimBarHtml("感觉 S", "直觉 N", displayPct.SN)}
          ${dimBarHtml("思考 T", "情感 F", displayPct.TF)}
          ${dimBarHtml("判断 J", "感知 P", displayPct.JP)}
        </div>

        <div class="result-code-box">
          <div style="flex:1;">
            <div class="result-code-label">你的人格码 · 分享给朋友合调</div>
            <div class="result-code" id="myCode">${code}</div>
          </div>
          <button class="btn-copy" id="btnCopyCode">复制</button>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" data-nav="cocktail">去合调一杯 🍸</button>
          <button class="btn btn-ghost" data-nav="cabinet">饮品柜</button>
          <button class="btn btn-ghost" data-nav="test">重新测试</button>
        </div>
      </div>
    </div>`;

  setTimeout(() => {
    $$(".dim-fill").forEach((el) => {
      el.style.width = `${el.dataset.width}%`;
    });
  }, 100);

  $("#btnCopyCode").addEventListener("click", () => {
    copyToClipboard(code);
    toast("人格码已复制到剪贴板 ✦");
  });
}

function computePctFromScores(scores) {
  if (!scores) return { EI: 50, SN: 50, TF: 50, JP: 50 };
  return {
    EI: (scores.E + scores.I) > 0 ? Math.round((scores.E / (scores.E + scores.I)) * 100) : 50,
    SN: (scores.S + scores.N) > 0 ? Math.round((scores.S / (scores.S + scores.N)) * 100) : 50,
    TF: (scores.T + scores.F) > 0 ? Math.round((scores.T / (scores.T + scores.F)) * 100) : 50,
    JP: (scores.J + scores.P) > 0 ? Math.round((scores.J / (scores.J + scores.P)) * 100) : 50,
  };
}

function dimBarHtml(leftLabel, rightLabel, leftPct) {
  const dominant = leftPct >= 50 ? "left" : "right";
  return `
    <div class="dim-bar dominant-${dominant}">
      <span class="left">${leftLabel}</span>
      <div class="dim-track">
        <div class="dim-fill" data-width="${leftPct}" style="width:0%"></div>
      </div>
      <span class="right">${rightLabel}</span>
    </div>`;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  ta.remove();
}

/* ============================================================
 * 六、饮品柜
 * ============================================================ */
async function renderCabinet() {
  try {
    const data = await DataAPI.getCabinet();
    const cocktailCount = data.cocktailCount || 0;

    const lv = bartenderLevel(cocktailCount);
    const nextHint = lv.next != null
      ? ` · 距下一等级还需 ${lv.next - cocktailCount} 次特调`
      : " · 已满级";
    $("#bartenderCard").innerHTML = `
      <div class="lv-lbl">BARTENDER LEVEL</div>
      <div class="lv-num">Lv.${lv.lv}</div>
      <div class="lv-name">${lv.name}</div>
      <div class="lv-progress">已调制 ${cocktailCount} 款特调${nextHint}</div>`;

    const cocktails = await DataAPI.getCocktails();
    if (!cocktails || cocktails.length === 0) {
      $("#cabinetGrid").innerHTML = `
        <div class="cab-empty">
          <div class="cab-empty-icon">🍸</div>
          <p class="cab-empty-text">还没有特调记录</p>
          <p class="cab-empty-sub">去和朋友合调一杯吧</p>
        </div>`;
      return;
    }

    $("#cabinetGrid").innerHTML = cocktails.map((c) => {
      const dA = DRINKS[c.typeA];
      const dB = DRINKS[c.typeB];
      if (!dA || !dB) return "";
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("zh-CN") : "";
      const isMyInit = (_currentUser && c.userId === _currentUser.id);
      const isMyPartner = (_currentUser && c.partnerUserId === _currentUser.id);
      const roleTag = isMyInit ? "我发起的" : (isMyPartner ? "朋友邀我" : "");
      return `
        <div class="cab-cocktail-item" data-cocktail-id="${c.id}">
          <div class="cab-drink-pair">
            <div class="cab-drink-svg">${renderDrinkSVG(c.typeA)}</div>
            <span class="cab-plus-icon">+</span>
            <div class="cab-drink-svg">${renderDrinkSVG(c.typeB)}</div>
          </div>
          <div class="cab-drink-names">
            <span style="color:${dA.color}">${dA.name}</span>
            <span class="cab-drink-x">×</span>
            <span style="color:${dB.color}">${dB.name}</span>
          </div>
          <div class="cab-cocktail-name">🍸 ${c.cocktailName || c.name || "特调"}</div>
          <div class="cab-cocktail-meta">
            <span class="cab-compat-badge">${c.compatibility}% 兼容</span>
            ${roleTag ? `<span class="cab-role-badge">${roleTag}</span>` : ""}
            <span class="cab-date">${dateStr}</span>
          </div>
        </div>`;
    }).join("");

    // 绑定点击事件
    setTimeout(() => {
      $$("#cabinetGrid .cab-cocktail-item").forEach(el => {
        el.addEventListener("click", async () => {
          const id = el.dataset.cocktailId;
          if (!id) return;
          try {
            const detail = await DataAPI.getCocktailDetail(id);
            showCocktailDetailModal(detail);
          } catch (err) {
            toast("加载详情失败，请稍后重试");
          }
        });
      });
    }, 0);
  } catch (err) {
    console.error("renderCabinet error:", err);
    $("#cabinetGrid").innerHTML = `<div class="cab-empty"><p class="cab-empty-text">加载失败,请稍后重试</p></div>`;
  }
}

/**
 * 特调详情弹窗
 */
function showCocktailDetailModal(detail) {
  // 移除旧弹窗
  const old = document.querySelector(".cd-modal-overlay");
  if (old) old.remove();

  const dA = DRINKS[detail.typeA];
  const dB = DRINKS[detail.typeB];
  const dateStr = detail.createdAt
    ? new Date(detail.createdAt).toLocaleDateString("zh-CN")
    : "";
  const compat = detail.compatibility || 50;

  // 判断双方是谁
  let initiatorLabel = "";
  let partnerLabel = "";
  if (_currentUser) {
    const myId = _currentUser.id;
    if (detail.initiator && detail.initiator.id === myId) {
      initiatorLabel = `<span class="cd-role-tag cd-role-me">我</span>`;
    }
    if (detail.partner && detail.partner.id === myId) {
      partnerLabel = `<span class="cd-role-tag cd-role-me">我</span>`;
    }
  }

  const initiatorName = (detail.initiator && (detail.initiator.nickname || detail.initiator.username)) || "未知用户";
  const partnerName = (detail.partner && (detail.partner.nickname || detail.partner.username))
    || (detail.partnerUserId ? `用户#${detail.partnerUserId}` : `${detail.typeB} · ${dB ? dB.name : (detail.drinkNameB || "未知")}`);

  // 生成混合特调 SVG
  const mixColor = mixHex(dA.color, dB.color);
  const cocktailSvg = `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 50 L 100 145 L 160 50 Z" fill="none" stroke="#3D2A1F" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="100" y1="145" x2="100" y2="205" stroke="#3D2A1F" stroke-width="2.5"/>
      <line x1="65" y1="225" x2="135" y2="225" stroke="#3D2A1F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="100" y1="205" x2="100" y2="225" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="cdCtkClip"><path d="M 42 52 L 100 143 L 158 52 Z"/></clipPath>
      <g clip-path="url(#cdCtkClip)">
        <rect x="35" y="50" width="130" height="50" fill="${dA.color}" opacity="0.95"/>
        <rect x="35" y="100" width="130" height="50" fill="${dB.color}" opacity="0.95"/>
        <rect x="35" y="85" width="130" height="20" fill="${mixColor}" opacity="0.6"/>
      </g>
      <circle cx="130" cy="55" r="5" fill="#C44E3A"/>
      <line x1="130" y1="55" x2="155" y2="35" stroke="#5A7F3C" stroke-width="2"/>
    </svg>`;

  const overlay = document.createElement("div");
  overlay.className = "cd-modal-overlay";
  overlay.innerHTML = `
    <div class="cd-modal" onclick="event.stopPropagation()">
      <button class="cd-modal-close" id="cdClose">×</button>

      <!-- 顶部视觉：混合特调 -->
      <div class="cd-visual cd-visual-mix">
        <div class="cd-cocktail-glass">${cocktailSvg}</div>
      </div>

      <!-- 特调名称 -->
      <div class="cd-name-section">
        <h2 class="cd-cocktail-name">🍸 ${detail.cocktailName || "特调"}</h2>
        <div class="cd-cocktail-sub">${detail.cocktailSubtitle || ""}</div>
      </div>

      <!-- 兼容度 -->
      <div class="cd-compat-section">
        <div class="cd-compat-label">兼容度</div>
        <div class="cd-compat-score">${compat}<small>/100</small></div>
        <div class="cd-compat-bar-wrap">
          <div class="cd-compat-bar-fill" style="width:0%"></div>
        </div>
      </div>

      <!-- 风味笔记 -->
      ${detail.notes ? `
      <div class="cd-notes">
        <div class="cd-notes-label">FLAVOR NOTES</div>
        <p class="cd-notes-text">${detail.notes}</p>
      </div>` : ""}

      <!-- 双方人格 -->
      <div class="cd-people">
        <div class="cd-person">
          <div class="cd-person-avatar">${detail.initiator ? (detail.initiator.avatar || "🍸") : "🍸"}</div>
          <div class="cd-person-info">
            <div class="cd-person-name">
              ${initiatorName}
              ${initiatorLabel}
            </div>
            <div class="cd-person-type">${detail.typeA} · ${dA ? dA.name : detail.drinkNameA}</div>
          </div>
          <div class="cd-person-badge">发起者</div>
        </div>
        <div class="cd-people-sep">
          <span class="cd-connector">×</span>
        </div>
        <div class="cd-person">
          <div class="cd-person-avatar">${detail.partner ? (detail.partner.avatar || "🍸") : "🍸"}</div>
          <div class="cd-person-info">
            <div class="cd-person-name">
              ${detail.partner || detail.partnerUserId ? partnerName : `<span style="font-size:13px;color:var(--ink-dim);font-weight:400;">${partnerName}</span>`}
              ${partnerLabel}
            </div>
            <div class="cd-person-type">${detail.typeB} · ${dB ? dB.name : detail.drinkNameB}</div>
          </div>
          <div class="cd-person-badge">${detail.partnerUserId ? "受邀者" : "访客"}</div>
        </div>
      </div>

      <!-- 日期 -->
      ${dateStr ? `<div class="cd-date">调制于 ${dateStr}</div>` : ""}
    </div>`;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeCocktailModal();
  });
  document.body.appendChild(overlay);

  // 关闭按钮
  overlay.querySelector("#cdClose").addEventListener("click", closeCocktailModal);

  // 兼容度动画
  setTimeout(() => {
    const fill = overlay.querySelector(".cd-compat-bar-fill");
    if (fill) fill.style.width = compat + "%";
  }, 100);

  // ESC 关闭
  const escHandler = (e) => { if (e.key === "Escape") { closeCocktailModal(); document.removeEventListener("keydown", escHandler); } };
  document.addEventListener("keydown", escHandler);
}

function closeCocktailModal() {
  const overlay = document.querySelector(".cd-modal-overlay");
  if (overlay) {
    overlay.classList.add("cd-fade-out");
    setTimeout(() => overlay.remove(), 250);
  }
}

/* ============================================================
 * 七、双人特调
 * ============================================================ */
async function initCocktailPage() {
  const myResult = await DataAPI.getLastResult();
  if (myResult && myResult.drink) {
    const d = myResult.drink;
    $("#myDrinkBox").innerHTML = `
      <div class="mix-drink-preview">
        ${renderDrinkSVG(myResult.mbti)}
        <div class="nm">${d.name}</div>
        <div class="ty">${d.en} · ${myResult.mbti}</div>
      </div>`;
  } else {
    $("#myDrinkBox").innerHTML = `
      <div class="mix-drink-empty">
        <div class="em-icon">🥃</div>
        <div class="em-text">
          你还没有人格饮料,<br/>
          <a data-nav="test">先去测一下 →</a>
        </div>
      </div>`;
  }

  $("#friendCode").value = "";
  $("#friendDrinkBox").classList.add("hidden");
  $("#cocktailResult").classList.add("hidden");

  $("#friendCode").addEventListener("input", onFriendCodeInput);
  $("#btnMix").onclick = handleMix;
}

function onFriendCodeInput(e) {
  const result = parseCode(e.target.value);
  const box = $("#friendDrinkBox");
  if (result && result.mbti) {
    const d = DRINKS[result.mbti];
    box.innerHTML = `
      <div class="mix-drink-preview">
        ${renderDrinkSVG(result.mbti)}
        <div class="nm">${d.name}</div>
        <div class="ty">${d.en} · ${result.mbti}</div>
      </div>`;
    box.classList.remove("hidden");
  } else {
    box.classList.add("hidden");
  }
}

async function handleMix() {
  const myResult = await DataAPI.getLastResult();
  if (!myResult || !myResult.drink) {
    toast("先去做一次测试才能合调哦");
    return;
  }
  const codeResult = parseCode($("#friendCode").value);
  if (!codeResult || !codeResult.mbti) {
    toast("没看懂朋友的人格码,检查一下格式");
    return;
  }
  const friendMBTI = codeResult.mbti;
  const cocktail = generateCocktail(myResult.mbti, friendMBTI);
  renderCocktailResult(cocktail);

  // 朋友的用户ID（如果人格码中包含了的话）
  await DataAPI.saveCocktail(cocktail, codeResult.userId);
  toast("特调已保存，双方都能在饮品柜中看到 ✦", 3000);
}

function renderCocktailResult(c) {
  if (!c.drinkA || !c.drinkB) return;
  const mixColor = mixHex(c.drinkA.color, c.drinkB.color);
  const cocktailSvg = `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 50 L 100 145 L 160 50 Z" fill="none" stroke="#3D2A1F" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="100" y1="145" x2="100" y2="205" stroke="#3D2A1F" stroke-width="2.5"/>
      <line x1="65" y1="225" x2="135" y2="225" stroke="#3D2A1F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="100" y1="205" x2="100" y2="225" stroke="#3D2A1F" stroke-width="2.5"/>
      <clipPath id="ctkClip"><path d="M 42 52 L 100 143 L 158 52 Z"/></clipPath>
      <g clip-path="url(#ctkClip)">
        <rect x="35" y="50" width="130" height="50" fill="${c.drinkA.color}" opacity="0.95"/>
        <rect x="35" y="100" width="130" height="50" fill="${c.drinkB.color}" opacity="0.95"/>
        <rect x="35" y="85" width="130" height="20" fill="${mixColor}" opacity="0.6"/>
      </g>
      <circle cx="130" cy="55" r="5" fill="#C44E3A"/>
      <line x1="130" y1="55" x2="155" y2="35" stroke="#5A7F3C" stroke-width="2"/>
    </svg>`;

  const el = $("#cocktailResult");
  el.innerHTML = `
    <div class="cocktail-glass">${cocktailSvg}</div>
    <div class="cocktail-info">
      <div class="ctk-eyebrow">— Special Mix · ${c.drinkA.en} × ${c.drinkB.en}</div>
      <h2 class="ctk-name">「${c.name}」</h2>
      <div class="ctk-subtitle">${c.subtitle}</div>
      <div class="compat-row">
        <div>
          <div class="compat-label">兼容度</div>
          <div class="compat-score">${c.compatibility}<small>/100</small></div>
        </div>
        <div class="compat-bar"><div class="compat-fill" style="width:0%"></div></div>
      </div>
      <div class="flavor-notes">
        <div class="fn-label">FLAVOR NOTES</div>
        ${c.notes}
      </div>
      <div style="font-size:13px;color:var(--ink-dim); line-height:1.7;">
        本特调由 <strong>${c.typeA} · ${c.drinkA.name}</strong> 与 <strong>${c.typeB} · ${c.drinkB.name}</strong> 合成 ·
        已同步到双方的饮品柜。
      </div>
    </div>`;
  el.classList.remove("hidden");
  setTimeout(() => { $(".compat-fill").style.width = c.compatibility + "%"; }, 100);
  setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
}

function mixHex(a, b) {
  const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  return `rgb(${(ar + br) >> 1}, ${(ag + bg) >> 1}, ${(ab + bb) >> 1})`;
}

/* ============================================================
 * 八、个人中心（含登录/注册 + 人格详情）
 * ============================================================ */
async function renderProfile() {
  // 渲染登录/注册区
  renderAuthSection();

  // 如果已登录，渲染数据卡片
  if (_currentUser) {
    try {
      const [result, cab, cocktails] = await Promise.all([
        DataAPI.getLastResult(),
        DataAPI.getCabinet(),
        DataAPI.getCocktails(),
      ]);

      $("#profileGrid").innerHTML = `
        <div class="pf-card">
          <div class="pf-label">CURRENT DRINK</div>
          <div class="pf-value">${(result && result.drink) ? result.drink.name : "—"}</div>
          <div class="pf-sub">${(result && result.mbti) ? result.mbti + " · 上次测试于 " + formatDate(result.testedAt) : "还没测试过"}</div>
        </div>
        <div class="pf-card">
          <div class="pf-label">COLLECTION</div>
          <div class="pf-value">${cab.cocktailCount || cocktails.length}</div>
          <div class="pf-sub">特调饮品收藏数</div>
        </div>
        <div class="pf-card">
          <div class="pf-label">COCKTAILS MIXED</div>
          <div class="pf-value">${cab.cocktailCount || cocktails.length}</div>
          <div class="pf-sub">${cocktails.length === 0 ? "去和朋友合调一杯" : "最近一次:" + (cocktails[0]?.cocktailName || cocktails[0]?.name || "—")}</div>
        </div>`;

      // 渲染人格详情卡片（如果测试过）
      if (result && result.drink) {
        renderPersonalityDetail(result);
      } else {
        $("#personalityDetail").innerHTML = "";
      }
    } catch (err) {
      console.error("renderProfile error:", err);
    }
  } else {
    // 未登录状态
    $("#profileGrid").innerHTML = `
      <div class="pf-card" style="grid-column:1/-1;text-align:center;padding:40px;">
        <div class="pf-label">—</div>
        <div class="pf-value" style="font-size:20px;">登录后查看你的数据</div>
        <div class="pf-sub">注册账号后，所有测试结果和特调记录会保存在云端，换设备也不会丢失。</div>
      </div>`;
    $("#personalityDetail").innerHTML = "";
  }
}

/**
 * 渲染登录/注册区
 */
function renderAuthSection() {
  if (_currentUser) {
    $("#authSection").innerHTML = `
      <div class="auth-logged-in">
        <div class="auth-avatar">${_currentUser.avatar || "🍸"}</div>
        <div class="auth-user-info">
          <div class="auth-username">${_currentUser.nickname || _currentUser.username}</div>
          <div class="auth-uid">@${_currentUser.username}</div>
        </div>
        <button class="btn btn-ghost" id="btnLogout">退出登录</button>
      </div>`;
    $("#btnLogout").addEventListener("click", async () => {
      await DataAPI.logout();
      await renderProfile();
      toast("已退出登录");
    });
  } else {
    $("#authSection").innerHTML = `
      <div class="auth-form-wrap">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">登录</button>
          <button class="auth-tab" data-tab="register">注册</button>
        </div>
        <form id="authForm" class="auth-form">
          <input type="text" id="authUsername" placeholder="用户名" required minlength="2" maxlength="32" />
          <input type="password" id="authPassword" placeholder="密码（至少4位）" required minlength="4" />
          <input type="text" id="authNickname" placeholder="昵称（仅注册时需要）" style="display:none;" />
          <div class="auth-error" id="authError" style="display:none;"></div>
          <button type="submit" class="btn btn-primary" id="authSubmit">登录</button>
        </form>
      </div>`;

    // 切换 登录/注册 tab
    $$("#authSection .auth-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        $$("#authSection .auth-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const isReg = tab.dataset.tab === "register";
        $("#authNickname").style.display = isReg ? "block" : "none";
        $("#authSubmit").textContent = isReg ? "注册" : "登录";
      });
    });

    // 表单提交
    $("#authForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = $("#authUsername").value.trim();
      const password = $("#authPassword").value;
      const isReg = $$("#authSection .auth-tab.active")[0]?.dataset.tab === "register";
      const errEl = $("#authError");
      errEl.style.display = "none";

      try {
        let resp;
        if (isReg) {
          const nickname = $("#authNickname").value.trim() || username;
          resp = await DataAPI.register(username, password, nickname);
        } else {
          resp = await DataAPI.login(username, password);
        }
        if (resp.success) {
          toast(isReg ? "注册成功！" : "登录成功！");
          await renderProfile();
        } else {
          errEl.textContent = resp.message || "操作失败";
          errEl.style.display = "block";
        }
      } catch (err) {
        errEl.textContent = "网络错误或服务器异常";
        errEl.style.display = "block";
      }
    });
  }
}

/**
 * 渲染人格详情 + 特调码卡片
 */
function renderPersonalityDetail(result) {
  const { mbti, drink, scores, no } = result;
  const code = generateCode(mbti);
  const displayPct = result.pct || computePctFromScores(scores);

  $("#personalityDetail").innerHTML = `
    <div class="pd-card">
      <div class="pd-header">
        <div class="pd-glass">${renderDrinkSVG(mbti)}</div>
        <div class="pd-header-info">
          <div class="pd-eyebrow">— YOUR DRINK IDENTITY</div>
          <h2 class="pd-name">${drink.name}</h2>
          <div class="pd-en">${drink.en} · ${mbti}</div>
          <div class="pd-slogan">${drink.slogan}</div>
        </div>
      </div>

      <div class="pd-body">
        <div class="pd-section">
          <h3 class="pd-section-title">人格描述</h3>
          <p class="pd-desc">${drink.description}</p>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">维度分布</h3>
          <div class="dimension-bars">
            ${dimBarHtml("外向 E", "内向 I", displayPct.EI)}
            ${dimBarHtml("感觉 S", "直觉 N", displayPct.SN)}
            ${dimBarHtml("思考 T", "情感 F", displayPct.TF)}
            ${dimBarHtml("判断 J", "感知 P", displayPct.JP)}
          </div>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">你的人格码</h3>
          <div class="pd-code-box">
            <span class="pd-code-text" id="pdCode">${code}</span>
            <button class="btn-copy" id="btnPdCopy">复制</button>
          </div>
          <p class="pd-code-hint">把这个码发给朋友，你们就能在「双人特调」页面合调一杯专属鸡尾酒。</p>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">标签</h3>
          <div class="result-tags">${(drink.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      </div>

      <div class="pd-actions">
        <button class="btn btn-primary" data-nav="result">查看完整结果</button>
        <button class="btn btn-ghost" data-nav="cocktail">去合调</button>
        <button class="btn btn-ghost" data-nav="test">重新测试</button>
      </div>
    </div>`;

  setTimeout(() => {
    $$(".pd-card .dim-fill").forEach((el) => {
      el.style.width = `${el.dataset.width}%`;
    });
  }, 200);

  $("#btnPdCopy").addEventListener("click", () => {
    copyToClipboard(code);
    toast("人格码已复制 ✦");
  });
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/* ============================================================
 * 九、绑定全局按钮 & 初始化
 * ============================================================ */
$("#btnNext").addEventListener("click", nextQuestion);
$("#btnPrev").addEventListener("click", prevQuestion);
$("#btnClear").addEventListener("click", async () => {
  if (confirm("确定清空全部测试结果和特调记录吗?此操作不可恢复。")) {
    try {
      await DataAPI.clearAll();
      toast("已清空所有数据");
    } catch (e) {
      toast("清空失败,请稍后重试");
    }
    await renderProfile();
  }
});

// 启动
(async function boot() {
  await initRefData();
  // 尝试恢复登录态
  await DataAPI.getCurrentUser();
  navigateTo("home");
})();
