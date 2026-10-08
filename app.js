/* Rosa app logic — static, no build */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);

  /* ---------- Liturgical auto-detect ---------- */
  function easterSunday(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function nthSundayOfAdvent(year) {
    // Advent Sunday IV = Sunday on/before Dec 24 that is closest: find Sunday before Christmas
    const christmas = new Date(year, 11, 25);
    const dow = christmas.getDay(); // 0 Sun
    const adv4 = addDays(christmas, -((dow + 1) % 7) - 21 - 7 + 7); // back to Advent I? compute simply:
    // Easier: Advent I = Sunday between Nov 27 and Dec 3
    for (let d = 27; d <= 31; d++) {
      const cand = new Date(d > 30 ? year : year, d > 30 ? 11 : 10, d > 30 ? d - 30 : d);
    }
    // Robust: first Sunday of Advent = Sunday falling Nov 27 – Dec 3
    for (let day = 27; day <= 33; day++) {
      const dt = day <= 30 ? new Date(year, 10, day) : new Date(year, 11, day - 30);
      if (dt.getDay() === 0) return startOfDay(dt);
    }
    return new Date(year, 11, 1);
  }
  function detectSeason(date) {
    const y = date.getFullYear();
    const t = startOfDay(date).getTime();
    const easter = startOfDay(easterSunday(y));
    const ashWed = addDays(easter, -46);
    const holySat = addDays(easter, -1);
    const pentecost = addDays(easter, 49);
    // Easter season of previous year can spill into January: compute previous Easter too
    const easterPrev = startOfDay(easterSunday(y - 1));
    const pentPrev = addDays(easterPrev, 49);
    const adv1 = nthSundayOfAdvent(y);
    const christmas = startOfDay(new Date(y, 11, 25));
    const adv1Next = nthSundayOfAdvent(y + 1);
    const inRange = (a, b) => t >= startOfDay(a).getTime() && t <= startOfDay(b).getTime();
    if (inRange(ashWed, holySat)) return "prapaskah";
    if (inRange(easter, pentecost)) return "paskah";
    if (y === date.getFullYear() && date.getMonth() === 0 && inRange(new Date(y, 0, 1), pentPrev > new Date(y, 0, 12) ? new Date(y, 0, 12) : pentPrev)) {
      // Baptism of Lord ~ mid-Jan; treat Jan 1–12 as Natal if after Christmas of prev year
      const dec25prev = new Date(y - 1, 11, 25);
      if (date >= dec25prev) return "natal";
    }
    if (inRange(adv1, addDays(christmas, -1))) return "adven";
    if ((date.getMonth() === 11 && date.getDate() >= 25) || (date.getMonth() === 0 && date.getDate() <= 12)) return "natal";
    if (t >= adv1Next.getTime()) return "adven";
    return "biasa";
  }
  function weekdayMystery(date) {
    const d = date.getDay(); // 0 Sun
    if (d === 1 || d === 6) return "gembira";
    if (d === 2 || d === 5) return "sedih";
    if (d === 0 || d === 3) return "mulia";
    return "terang";
  }
  function autoMystery(date) {
    const season = detectSeason(date);
    if (season === "adven" || season === "natal") return { id: "gembira", season, by: "masa" };
    if (season === "prapaskah") return { id: "sedih", season, by: "masa" };
    if (season === "paskah") return { id: "mulia", season, by: "masa" };
    return { id: weekdayMystery(date), season: "biasa", by: "hari" };
  }

  /* ---------- State ---------- */
  const LS = "rosa-state-v1";
  const today = new Date();
  const auto = autoMystery(today);
  let state = {
    mystery: auto.id,
    autoInfo: auto,
    mode: "single", // single | group
    users: ["Umat 1", "Umat 2", "Umat 3", "Umat 4"],
    leader: "Pemimpin",
    pos: 0,
    font: 1,
    dark: true
  };
  let savedPos = 0, hashPos = null;
  try {
    const raw = localStorage.getItem(LS);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.users) && s.users.length >= 2) state.users = s.users.slice(0, 50);
      if (s && typeof s.mystery === "string" && MYSTERIES[s.mystery]) state.mystery = s.mystery;
      if (s && (s.mode === "single" || s.mode === "group")) state.mode = s.mode;
      if (s && typeof s.leader === "string" && s.leader.trim()) state.leader = s.leader;
      if (s && typeof s.font === "number") state.font = Math.min(1.35, Math.max(0.85, s.font));
      if (s && typeof s.dark === "boolean") state.dark = s.dark;
      if (s && typeof s.pos === "number") savedPos = s.pos;
    }
    const hm = location.hash.match(/s=(\d+)/);
    if (hm) hashPos = parseInt(hm[1], 10);
    if (hashPos !== null && !Number.isNaN(hashPos)) { state.pos = hashPos; savedPos = hashPos; }
  } catch (e) { /* ignore */ }

  let steps = buildSteps(state.mystery);
  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify({ mystery: state.mystery, mode: state.mode, users: state.users, leader: state.leader, font: state.font, dark: state.dark, pos: state.pos }));
    } catch (e) {}
  }
  function clampPos() {
    if (state.pos < 0) state.pos = 0;
    if (state.pos > steps.length - 1) state.pos = steps.length - 1;
  }
  clampPos();

  /* ---------- Rosary SVG ---------- */
  // Layout: ellipse loop (5 decades) + pendant tail.
  // beadMap: stepIndex -> bead element id
  let beadStep = []; // beadIdx -> stepIndex (first step that lights it)
  // Teardrop loop with beads spaced evenly by ARC LENGTH (no overlap),
  // instead of by angle (which bunches beads at the narrow ends).
  // u=0 at the junction (bottom), clockwise. Extra arc before each big
  // bead keeps the 5 decades readable as groups.
  function loopPoints(cx, cy, rx, ry, n, extra) {
    const pt = (u) => {
      const a = Math.PI + u * Math.PI * 2;
      const p = (1 - Math.cos(a - Math.PI)) / 2; // 0 at junction -> 1 at top
      const w = 1 - 0.5 * Math.pow(1 - p, 1.6);
      return [cx + rx * Math.sin(a) * w, cy - ry * Math.cos(a)];
    };
    const M = 1440, dense = [pt(0)], cum = [0];
    for (let k = 1; k <= M; k++) {
      const p = pt(k / M), q = dense[k - 1];
      dense.push(p);
      cum.push(cum[k - 1] + Math.hypot(p[0] - q[0], p[1] - q[1]));
    }
    const L = cum[M];
    const radii = [];
    for (let i = 0; i < n; i++) radii.push(i % 11 === 0 ? 7.5 : 5);
    const sumD = radii.reduce((a, r) => a + 2 * r, 0);
    const g = (L - sumD - 5 * extra) / n; // even edge-to-edge gap
    const at = (s) => {
      s = ((s % L) + L) % L;
      let lo = 0, hi = M;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < s) lo = mid + 1; else hi = mid; }
      const k = Math.max(1, lo), s0 = cum[k - 1], s1 = cum[k];
      const t = s1 > s0 ? (s - s0) / (s1 - s0) : 0;
      const A = dense[k - 1], B = dense[k];
      return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
    };
    const pts = [];
    let cursor = 0;
    for (let i = 0; i < n; i++) {
      pts.push(at(cursor + radii[i]));
      cursor += 2 * radii[i] + g + ((i + 1) % 11 === 0 ? extra : 0);
    }
    return pts;
  }
  function renderRosary() {
    const svg = $("#rosarySvg");
    const NS = "http://www.w3.org/2000/svg";
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    beadStep = [];
    const W = 360, H = 480;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const cx = 180, cy = 140, rx = 140, ry = 118;
    // junction (centerpiece) at bottom of the teardrop; pendant hangs below it
    const pendantX = cx, pendantTopY = cy + ry; // ~258
    const crossTop = pendantTopY + 138; // crucifix top (~396)
    const N = 55; // 5 x (1 Bapa Kami + 10 Salam Maria)
    const pts = loopPoints(cx, cy, rx, ry, N, 7);
    // draw loop string
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M ${pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ")} Z`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-opacity", "0.25");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
    // pendant string
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", pendantX); line.setAttribute("y1", pendantTopY + 29);
    line.setAttribute("x2", pendantX); line.setAttribute("y2", crossTop);
    line.setAttribute("stroke", "currentColor"); line.setAttribute("stroke-opacity", "0.25");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);

    // Map loop beads: index 0 = centerpiece junction (bottom), then decades clockwise.
    // Order decades: decade d (0..4) beads: 1 big (Bapa) + 10 small (Salam) then gap handled by spacing.
    // We place 55 positions; mark every 11th as "big".
    const beadsG = document.createElementNS(NS, "g");
    svg.appendChild(beadsG);
    const loopBeads = [];
    for (let i = 0; i < N; i++) {
      const isBig = i % 11 === 0;
      const dec = Math.floor(i / 11) + 1;
      const sub = i % 11;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", pts[i][0].toFixed(1)); c.setAttribute("cy", pts[i][1].toFixed(1));
      c.setAttribute("r", isBig ? 7.5 : 5);
      c.setAttribute("class", isBig ? "bead bead-big" : "bead bead-small");
      c.dataset.bead = "L" + i;
      c.style.cursor = "pointer";
      const title = document.createElementNS(NS, "title");
      title.textContent = isBig
        ? `Peristiwa ${dec}/5 — Bapa Kami`
        : `Peristiwa ${dec}/5 — Salam Maria ${sub}/10`;
      c.appendChild(title);
      beadsG.appendChild(c);
      loopBeads.push(c);
    }
    // centerpiece: Miraculous Medal image in an oval frame (fallback disc behind it)
    const defs = document.createElementNS(NS, "defs");
    const clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", "medalClip");
    const clipE = document.createElementNS(NS, "ellipse");
    clipE.setAttribute("cx", pendantX); clipE.setAttribute("cy", pendantTopY);
    clipE.setAttribute("rx", 18); clipE.setAttribute("ry", 30);
    clip.appendChild(clipE);
    defs.appendChild(clip);
    svg.appendChild(defs);
    const center = document.createElementNS(NS, "g");
    center.style.cursor = "pointer";
    center.dataset.bead = "C";
    const medalBg = document.createElementNS(NS, "ellipse");
    medalBg.setAttribute("cx", pendantX); medalBg.setAttribute("cy", pendantTopY);
    medalBg.setAttribute("rx", 18); medalBg.setAttribute("ry", 30);
    medalBg.setAttribute("class", "bead-center");
    center.appendChild(medalBg);
    const medalImg = document.createElementNS(NS, "image");
    medalImg.setAttribute("href", "./medal.jpg");
    medalImg.setAttribute("x", pendantX - 20); medalImg.setAttribute("y", pendantTopY - 33);
    medalImg.setAttribute("width", 40); medalImg.setAttribute("height", 66);
    medalImg.setAttribute("clip-path", "url(#medalClip)");
    medalImg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    center.appendChild(medalImg);
    const medalFrame = document.createElementNS(NS, "ellipse");
    medalFrame.setAttribute("cx", pendantX); medalFrame.setAttribute("cy", pendantTopY);
    medalFrame.setAttribute("rx", 18); medalFrame.setAttribute("ry", 30);
    medalFrame.setAttribute("fill", "none");
    medalFrame.setAttribute("stroke", "#f59e0b");
    medalFrame.setAttribute("stroke-width", "2.5");
    center.appendChild(medalFrame);
    const mTitle = document.createElementNS(NS, "title");
    mTitle.textContent = "Bunda Maria — Maria Dikandung Tanpa Noda";
    center.appendChild(mTitle);
    beadsG.appendChild(center);
    // pendant beads, traditional order from the cross upward:
    // P0 Bapa Kami, P1-P3 Salam Maria, P4 Kemuliaan, then the medal.
    // Centers computed from radii so every gap is an even 10px.
    const order = [
      { key: "P4", r: 7.5, cls: "bead bead-big", label: "Kemuliaan" },
      { key: "P3", r: 5, cls: "bead bead-small", label: "Salam Maria 3/3" },
      { key: "P2", r: 5, cls: "bead bead-small", label: "Salam Maria 2/3" },
      { key: "P1", r: 5, cls: "bead bead-small", label: "Salam Maria 1/3" },
      { key: "P0", r: 7.5, cls: "bead bead-big", label: "Bapa Kami" }
    ];
    const pendBeads = [];
    {
      let yy = pendantTopY + 38; // below medal + even gap
      order.forEach((b) => {
        yy += b.r;
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", pendantX); c.setAttribute("cy", yy.toFixed(1));
        c.setAttribute("r", b.r);
        c.setAttribute("class", b.cls);
        c.dataset.bead = b.key;
        c.style.cursor = "pointer";
        const t = document.createElementNS(NS, "title");
        t.textContent = b.label;
        c.appendChild(t);
        beadsG.appendChild(c);
        pendBeads.push(c);
        yy += b.r + 8;
      });
    }
    // crucifix with corpus, drawn with rects + circle
    const cross = document.createElementNS(NS, "g");
    cross.style.cursor = "pointer";
    cross.dataset.bead = "X";
    const cv = document.createElementNS(NS, "rect");
    cv.setAttribute("x", pendantX - 5); cv.setAttribute("y", crossTop);
    cv.setAttribute("width", 10); cv.setAttribute("height", 48); cv.setAttribute("rx", 2);
    const ch = document.createElementNS(NS, "rect");
    ch.setAttribute("x", pendantX - 15); ch.setAttribute("y", crossTop + 10);
    ch.setAttribute("width", 30); ch.setAttribute("height", 9); ch.setAttribute("rx", 2);
    [cv, ch].forEach((r) => { r.setAttribute("fill", "#f59e0b"); r.setAttribute("stroke", "#92400e"); r.setAttribute("stroke-width", "1.5"); cross.appendChild(r); });
    const flesh = "#7c2d12"; // corpus silhouette
    const head = document.createElementNS(NS, "circle");
    head.setAttribute("cx", pendantX); head.setAttribute("cy", crossTop + 7);
    head.setAttribute("r", 3.5); head.setAttribute("fill", flesh);
    const arms = document.createElementNS(NS, "rect");
    arms.setAttribute("x", pendantX - 9); arms.setAttribute("y", crossTop + 12);
    arms.setAttribute("width", 18); arms.setAttribute("height", 3.5); arms.setAttribute("rx", 1.5);
    arms.setAttribute("fill", flesh);
    const body = document.createElementNS(NS, "rect");
    body.setAttribute("x", pendantX - 2.5); body.setAttribute("y", crossTop + 12);
    body.setAttribute("width", 5); body.setAttribute("height", 22); body.setAttribute("rx", 2);
    body.setAttribute("fill", flesh);
    [head, arms, body].forEach((r) => cross.appendChild(r));
    const ct = document.createElementNS(NS, "title");
    ct.textContent = "Tanda Salib / Aku Percaya";
    cross.appendChild(ct);
    beadsG.appendChild(cross);

    // Strict bead mapping: only real prayer beads light up hard (bead-now);
    // announcements and closing prayers glow softly (bead-soft) on the nearest bead.
    const all = { X: cross, C: center };
    loopBeads.forEach((el, i) => (all["L" + i] = el));
    pendBeads.forEach((el) => (all[el.dataset.bead] = el));
    window.__beads = all;

    // click handlers
    Object.values(all).forEach((el) => {
      el.addEventListener("click", () => {
        const si = parseInt(el.dataset.step, 10);
        if (!Number.isNaN(si)) goTo(si);
      });
    });
    renderCompact();
    paintBeads();
  }

  // Compact rosary for mobile: pendant row + 5 decade rows of tappable dots.
  function renderCompact() {
    const comp = $("#rosaryCompact");
    if (!comp) return;
    comp.innerHTML = "";
    const goBead = (key) => {
      const p = (window.__primary || {})[key];
      if (p !== undefined) goTo(p);
    };
    const dot = (key, big, label) => {
      const b = document.createElement("button");
      b.className = "cdot" + (big ? " cdot-big" : "");
      b.dataset.bead = key;
      b.title = label;
      b.setAttribute("aria-label", label);
      b.addEventListener("click", () => goBead(key));
      return b;
    };
    const pend = document.createElement("div");
    pend.className = "flex items-center justify-center gap-1.5 mb-2 flex-wrap";
    // First bead: cross (unicode) instead of dot
    const crossBtn = document.createElement("button");
    crossBtn.type = "button";
    crossBtn.className = "cdot cdot-big";
    crossBtn.dataset.bead = "X";
    crossBtn.title = "Tanda Salib";
    crossBtn.setAttribute("aria-label", "Tanda Salib");
    // Use unicode latin cross ✝
    crossBtn.innerHTML = "✝";
    crossBtn.addEventListener("click", () => goTo(0));
    pend.appendChild(crossBtn);
    ["P0", "P1", "P2", "P3"].forEach((k, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cdot" + (k === "P0" ? " cdot-big" : "");
      b.dataset.bead = k;
      b.title = k === "P0" ? "Bapa Kami" : `Salam Maria ${i + 1}/3`;
      b.setAttribute("aria-label", k === "P0" ? "Bapa Kami" : `Salam Maria ${i + 1}/3`);
      b.innerHTML = "";
      b.addEventListener("click", () => goBead(k));
      pend.appendChild(b);
    });
    pend.appendChild(dot("P4", true, "Kemuliaan"));
    // Medal: use ✻ (virtue/medal outline) as symbol; lights up with same classes
    const medalBtn = document.createElement("button");
    medalBtn.type = "button";
    medalBtn.className = "cdot cdot-big";
    medalBtn.dataset.bead = "C";
    medalBtn.title = "Medali Bunda Maria";
    medalBtn.setAttribute("aria-label", "Medali Bunda Maria");
    medalBtn.innerHTML = "✻";
    medalBtn.addEventListener("click", () => goTo(steps.length - 1));
    pend.appendChild(medalBtn);
    comp.appendChild(pend);
    for (let d = 0; d < 5; d++) {
      const row = document.createElement("div");
      row.className = "flex items-center justify-center gap-1.5 mb-1.5 flex-wrap";
      const tag = document.createElement("span");
      tag.className = "text-[10px] text-slate-500 w-3";
      tag.textContent = d + 1;
      row.appendChild(tag);
      row.appendChild(dot("L" + (d * 11), true, `Peristiwa ${d + 1}/5 — Bapa Kami`));
      for (let j = 1; j <= 10; j++) row.appendChild(dot("L" + (d * 11 + j), false, `Peristiwa ${d + 1}/5 — Salam ${j}/10`));
      comp.appendChild(row);
    }
  }

  // Only real prayer beads map hard; announcements/closings map soft to the nearest bead.
  function beadForStep(stepIdx) {
    const s = steps[stepIdx];
    if (!s) return null;
    if (s.kind === "pembuka") return null;
    if (s.kind === "tanda" || s.kind === "percaya") return { key: "X", soft: false };
    if (s.kind === "bapa" && s.kicker === "Doa awal") return { key: "P0", soft: false };
    if (s.kind === "salam3") {
      const m = s.sub.match(/\((\d)\/3\)/);
      return { key: "P" + (m ? parseInt(m[1], 10) : 1), soft: false };
    }
    if (s.kind === "kemuliaan" && s.kicker === "Doa awal") return { key: "P4", soft: false };
    if (s.kind === "terpujilah" && s.kicker === "Doa awal") return { key: "P4", soft: true };
    // decades
    const mk = (s.sub || "").match(/(\d)\/5/);
    const d = mk ? parseInt(mk[1], 10) - 1 : 0;
    const base = d * 11;
    if (s.kind === "umum") return { key: "L" + base, soft: true };
    if (s.kind === "bapa") return { key: "L" + base, soft: false };
    if (s.kind === "salam") {
      const jm = (s.sub || "").match(/butir (\d+)\/10/);
      const j = jm ? parseInt(jm[1], 10) : 1;
      return { key: "L" + (base + j), soft: false };
    }
    if (s.kind === "kemuliaan" || s.kind === "terpujilah" || s.kind === "fatima") return { key: "L" + (base + 10), soft: true };
    if (s.kind === "ratu" || s.kind === "doakanlah" || s.kind === "marilah") return { key: "C", soft: true };
    return { key: "X", soft: true };
  }

  function paintBeads() {
    const all = window.__beads || {};
    // reset classes; assign click target = first hard step using each bead
    Object.values(all).forEach((el) => {
      el.classList.remove("bead-done", "bead-now", "bead-soft");
      el.dataset.step = "";
    });
    const primary = {};
    steps.forEach((s, i) => {
      const b = beadForStep(i);
      if (b && !b.soft && primary[b.key] === undefined) primary[b.key] = i;
    });
    Object.keys(primary).forEach((k) => { if (all[k]) all[k].dataset.step = String(primary[k]); });
    if (all.C && all.C.dataset.step === "") {
      const f = steps.findIndex((s, i) => { const b = beadForStep(i); return b && b.key === "C"; });
      if (f >= 0) all.C.dataset.step = String(f);
    }
    Object.keys(all).forEach((k) => {
      if (primary[k] !== undefined && primary[k] < state.pos) all[k].classList.add("bead-done");
    });
    const cur = beadForStep(state.pos);
    if (cur && all[cur.key]) all[cur.key].classList.add(cur.soft ? "bead-soft" : "bead-now");
    window.__primary = primary;
    // compact mobile dots mirror the same state
    document.querySelectorAll("#rosaryCompact [data-bead]").forEach((el) => {
      const k = el.dataset.bead;
      const isCurrent = cur && cur.key === k;
      el.classList.toggle("cdot-done", primary[k] !== undefined && primary[k] < state.pos);
      // if this bead is the current step, show "now" regardless of soft flag
      el.classList.toggle("cdot-now", isCurrent);
      // soft glow only for non-current steps of soft-beads
      el.classList.toggle("cdot-soft", !isCurrent && cur && cur.soft && cur.key === k);
    });
    const cn = $("#compactNow");
    if (cn) {
      const s = steps[state.pos];
      cn.textContent = `${state.pos + 1}/${steps.length} · ${s.title}${s.sub ? " — " + s.sub : ""}`;
    }
    // update mini dots strip
    const strip = $("#beadStrip");
    if (strip) {
      strip.innerHTML = "";
      steps.forEach((s, i) => {
        const b = document.createElement("button");
        b.className = "strip-dot" + (i === state.pos ? " strip-now" : i < state.pos ? " strip-done" : "");
        b.title = (i + 1) + ". " + s.title + (s.sub ? " — " + s.sub : "");
        b.setAttribute("aria-label", b.title);
        b.addEventListener("click", () => goTo(i));
        strip.appendChild(b);
      });
      const now = strip.querySelector(".strip-now");
      if (now) now.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }

  /* ---------- Render card ---------- */
  function assigneeFor(step) {
    if (step.salamKe === null || step.salamKe === undefined) return null;
    if (state.mode !== "group") return null;
    const n = state.users.length || 1;
    return state.users[((step.salamKe % n) + n) % n];
  }
  function stepLabel(step) {
    return `${step.index + 1} / ${steps.length}`;
  }
  function render() {
    clampPos();
    const s = steps[state.pos];
    // header
    $("#mysteryName").textContent = MYSTERIES[state.mystery].nama;
    const ai = state.autoInfo;
    const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][today.getDay()];
    const seasonLabel = { biasa: "Biasa", adven: "Adven", natal: "Natal", prapaskah: "Pra-Paskah", paskah: "Paskah" }[ai.season] || ai.season;
    $("#autoInfo").textContent = `Otomatis: ${dayName} · masa ${seasonLabel} → ${MYSTERIES[ai.id].nama}`;
    $("#modeBadge").textContent = state.mode === "group" ? `Kelompok (${state.users.length})` : "Sendiri";
    $("#posLabel").textContent = stepLabel(s);
    $("#progressFill").style.width = ((state.pos + 1) / steps.length * 100).toFixed(1) + "%";
    // card
    $("#kicker").textContent = s.kicker || "";
    $("#pTitle").textContent = s.title || "";
    $("#pSub").textContent = s.sub || "";
    const showAyat = !!s.ayat;
    $("#ayatWrap").style.display = showAyat ? "" : "none";
    if (showAyat) {
      $("#ayatText").textContent = s.ayat;
      $("#ayatRef").textContent = s.ref || "";
    }
    const body = $("#pBody");
    body.innerHTML = "";
    (s.text || []).forEach((p) => {
      const el = document.createElement("p");
      el.className = "pray-p" + (/^\s*catatan:/i.test(p) ? " italic opacity-80" : "");
      el.textContent = p;
      body.appendChild(el);
    });
    body.style.fontSize = (1.125 * state.font).toFixed(3) + "rem";
    // giliran badge: only Salam Maria decade steps (kind salam)
    const who = assigneeFor(s);
    const badge = $("#giliran");
    if (who && s.kind === "salam") {
      badge.style.display = "";
      $("#giliranName").textContent = who;
      $("#salamCount").textContent = `Salam ke-${s.salamKe + 1}/50`;
    } else {
      badge.style.display = "none";
    }
    // leader hint
    const lh = $("#leaderHint");
    if (state.mode === "group" && s.leader) {
      lh.style.display = "";
      $("#leaderName").textContent = state.leader || "Pemimpin";
    } else lh.style.display = "none";
    // nav buttons
    $("#btnBack").disabled = state.pos === 0;
    $("#btnNext").textContent = state.pos === steps.length - 1 ? "Selesai ✓" : "Lanjut →";
    // hash
    try { history.replaceState(null, "", "#s=" + state.pos); } catch (e) {}
    paintBeads();
    save();
  }

  function goTo(i) {
    state.pos = Math.max(0, Math.min(steps.length - 1, i));
    render();
  }
  function next() { goTo(state.pos + 1); }
  function back() { goTo(state.pos - 1); }

  /* ---------- Welcome modal ---------- */
  let resumePos = null;
  function openSetup(showResume) {
    $("#setupModal").classList.remove("hidden");
    if (showResume === false) $("#resumeBox").style.display = "none";
    syncSetupUI();
  }
  function closeSetup() { $("#setupModal").classList.add("hidden"); }
  function syncSetupUI() {
    const mc = $("#mysteryChoice");
    mc.value = state.mystery;
    $("#mysterySelect").value = state.mystery;
    $("#welcomeMystery").textContent = MYSTERIES[state.mystery].nama;
    try {
      $("#todayLine").textContent = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(today);
    } catch (e) { $("#todayLine").textContent = today.toDateString(); }
    $("#userCount").value = state.users.length;
    $("#leaderInput").value = state.leader || "";
    renderNameInputs();
  }
  function renderNameInputs() {
    const wrap = $("#nameList");
    wrap.innerHTML = "";
    state.users.forEach((nm, i) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2";
      const lab = document.createElement("span");
      lab.className = "w-8 text-xs text-slate-500 dark:text-slate-400";
      lab.textContent = i + 1;
      const inp = document.createElement("input");
      inp.value = nm;
      inp.className = "flex-1 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm outline-none focus:border-amber-400 dark:border-slate-700 dark:bg-slate-900";
      inp.placeholder = "Umat " + (i + 1);
      inp.addEventListener("input", () => { state.users[i] = inp.value.trim() || ("Umat " + (i + 1)); });
      row.appendChild(lab); row.appendChild(inp);
      wrap.appendChild(row);
    });
  }

  function wire() {
    $("#btnNext").addEventListener("click", next);
    $("#btnBack").addEventListener("click", back);
    $("#btnSetup").addEventListener("click", () => openSetup(false));
    $("#btnSetup2").addEventListener("click", () => openSetup(false));
    $("#btnChangeMystery").addEventListener("click", () => {
      const row = $("#mysteryPickRow");
      row.style.display = row.style.display === "none" ? "" : "none";
    });
    $("#btnStartSingle").addEventListener("click", () => {
      state.mode = "single"; steps = buildSteps(state.mystery); closeSetup(); goTo(0);
    });
    $("#btnStartGroup").addEventListener("click", () => {
      state.mode = "group";
      const go = $("#groupOpts");
      const show = go.style.display === "none";
      go.style.display = show ? "" : "none";
      if (show) { renderNameInputs(); $("#userCount").focus(); }
      render();
    });
    $("#setupClose").addEventListener("click", () => {
      state.mode = "group"; steps = buildSteps(state.mystery); closeSetup(); goTo(0);
    });
    $("#btnResume").addEventListener("click", () => { closeSetup(); goTo(resumePos === null ? 0 : resumePos); });
    $("#btnFresh").addEventListener("click", () => { $("#resumeBox").style.display = "none"; resumePos = null; state.pos = 0; render(); });
    $("#mysteryChoice").addEventListener("change", (e) => {
      state.mystery = e.target.value; steps = buildSteps(state.mystery); state.pos = 0;
      resumePos = null; $("#resumeBox").style.display = "none";
      render(); syncSetupUI();
    });

    $("#userCount").addEventListener("change", (e) => {
      let n = Math.max(2, Math.min(50, parseInt(e.target.value, 10) || 4));
      const cur = state.users.slice();
      while (cur.length < n) cur.push("Umat " + (cur.length + 1));
      state.users = cur.slice(0, n);
      renderNameInputs(); render();
    });
    $("#leaderInput").addEventListener("input", (e) => { state.leader = e.target.value.trim() || "Pemimpin"; render(); });
    $("#resetNames").addEventListener("click", () => {
      const n = state.users.length;
      state.users = Array.from({ length: n }, (_, i) => "Umat " + (i + 1));
      renderNameInputs(); render();
    });
    $("#mysterySelect").addEventListener("change", (e) => {
      state.mystery = e.target.value; steps = buildSteps(state.mystery); state.pos = 0; render();
    });
    $("#fontMinus").addEventListener("click", () => { state.font = Math.max(0.85, +(state.font - 0.05).toFixed(2)); render(); });
    $("#fontPlus").addEventListener("click", () => { state.font = Math.min(1.35, +(state.font + 0.05).toFixed(2)); render(); });
    $("#btnFull").addEventListener("click", () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    });
    $("#btnDark").addEventListener("click", () => { state.dark = !state.dark; applyTheme(); save(); });
    $("#btnRestart").addEventListener("click", () => goTo(0));
    document.addEventListener("keydown", (e) => {
      if (!$("#setupModal").classList.contains("hidden")) return;
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT")) return;
      if (e.code === "Space" || e.key === "Enter" || e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "PageUp") { e.preventDefault(); back(); }
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(steps.length - 1);
    });
    // swipe
    let tx = null;
    document.addEventListener("touchstart", (e) => { tx = e.changedTouches[0].clientX; }, { passive: true });
    document.addEventListener("touchend", (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 60) { if (dx < 0) next(); else back(); }
      tx = null;
    }, { passive: true });
    window.addEventListener("hashchange", () => {
      const h = parseInt((location.hash.match(/s=(\d+)/) || [])[1], 10);
      if (!Number.isNaN(h) && h !== state.pos) goTo(h);
    });
  }
  function applyTheme() {
    document.documentElement.classList.toggle("dark", state.dark);
    document.body.dataset.theme = state.dark ? "dark" : "light";
  }

  // init: welcome every visit; offer resume only for an unfinished prayer
  if (hashPos === null || Number.isNaN(hashPos)) {
    if (savedPos > 0 && savedPos < steps.length - 1) { resumePos = savedPos; state.pos = savedPos; }
    else state.pos = 0;
  }
  applyTheme();
  renderRosary();
  wire();
  $("#mysterySelect").value = state.mystery;
  if (resumePos !== null) {
    const st = steps[resumePos];
    $("#resumeDetail").textContent = `${MYSTERIES[state.mystery].nama} · langkah ${resumePos + 1}/${steps.length} · ${st.title}${st.sub ? " — " + st.sub : ""}`;
    $("#resumeBox").style.display = "";
  }
  render();
  openSetup(resumePos !== null);
})();
