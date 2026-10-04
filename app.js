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
    }
    const h = parseInt((location.hash.match(/s=(\d+)/) || [])[1], 10);
    if (!Number.isNaN(h)) state.pos = h;
  } catch (e) { /* ignore */ }

  let steps = buildSteps(state.mystery);
  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify({ mystery: state.mystery, mode: state.mode, users: state.users, leader: state.leader, font: state.font, dark: state.dark }));
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
  function loopPoints(cx, cy, rx, ry, n, rot) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return pts;
  }
  function renderRosary() {
    const svg = $("#rosarySvg");
    const NS = "http://www.w3.org/2000/svg";
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    beadStep = [];
    const W = 360, H = 430;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const cx = 180, cy = 165, rx = 128, ry = 118;
    // pendant from bottom of loop down
    const pendantX = cx, pendantTopY = cy + ry; // ~283
    // 53 loop beads: 5 x (1 big + 10 small), starting at top after centerpiece
    const N_LOOP = 53; // 5 Our Father + 48? Actually 5+50=55; use 55 for exactness
    const N = 55;
    const pts = loopPoints(cx, cy, rx, ry, N, -Math.PI / 2);
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
    line.setAttribute("x1", pendantX); line.setAttribute("y1", pendantTopY);
    line.setAttribute("x2", pendantX); line.setAttribute("y2", pendantTopY + 110);
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
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", pts[i][0]); c.setAttribute("cy", pts[i][1]);
      c.setAttribute("r", isBig ? 9 : 6.5);
      c.setAttribute("class", "bead");
      c.dataset.bead = "L" + i;
      c.style.cursor = "pointer";
      const title = document.createElementNS(NS, "title");
      title.textContent = isBig ? "Bapa Kami" : "Salam Maria";
      c.appendChild(title);
      beadsG.appendChild(c);
      loopBeads.push(c);
    }
    // centerpiece at junction
    const center = document.createElementNS(NS, "rect");
    center.setAttribute("x", pendantX - 8); center.setAttribute("y", pendantTopY - 8);
    center.setAttribute("width", 16); center.setAttribute("height", 16);
    center.setAttribute("rx", 4);
    center.setAttribute("class", "bead-center");
    center.style.cursor = "pointer";
    center.dataset.bead = "C";
    beadsG.appendChild(center);
    // pendant beads: from junction downward: 1 big (Bapa awal) + 3 small + 1 big (Kemuliaan) + cross
    const py = [pendantTopY + 22, pendantTopY + 44, pendantTopY + 62, pendantTopY + 80, pendantTopY + 98];
    const pr = [9, 6.5, 6.5, 6.5, 9];
    const plabel = ["Bapa Kami", "Salam Maria 1/3", "Salam Maria 2/3", "Salam Maria 3/3", "Kemuliaan"];
    const pendBeads = [];
    py.forEach((y, i) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", pendantX); c.setAttribute("cy", y);
      c.setAttribute("r", pr[i]);
      c.setAttribute("class", "bead");
      c.dataset.bead = "P" + i;
      c.style.cursor = "pointer";
      const t = document.createElementNS(NS, "title");
      t.textContent = plabel[i];
      c.appendChild(t);
      beadsG.appendChild(c);
      pendBeads.push(c);
    });
    // cross
    const cross = document.createElementNS(NS, "text");
    cross.setAttribute("x", pendantX); cross.setAttribute("y", pendantTopY + 140);
    cross.setAttribute("text-anchor", "middle");
    cross.setAttribute("font-size", "26");
    cross.setAttribute("class", "bead-cross");
    cross.style.cursor = "pointer";
    cross.dataset.bead = "X";
    cross.textContent = "✝";
    const ct = document.createElementNS(NS, "title");
    ct.textContent = "Tanda Salib / Aku Percaya";
    cross.appendChild(ct);
    beadsG.appendChild(cross);

    // Build mapping step -> bead element for click + highlight
    // Pendant steps 0..8 map: pembuka->X? tanda->X, percaya->X, bapa->P0, salam3->P1..P3, kemuliaan/terpujilah->P4
    // Loop: for decade d, umum->gap(big bead L(d*11)), bapa->L(d*11), salam j->L(d*11+1+j), kemuliaan/terpujilah/fatima->approach next big
    const all = { X: cross, C: center };
    loopBeads.forEach((el, i) => (all["L" + i] = el));
    pendBeads.forEach((el, i) => (all["P" + i] = el));
    window.__beads = all;

    // click handlers
    Object.values(all).forEach((el) => {
      el.addEventListener("click", () => {
        const si = parseInt(el.dataset.step, 10);
        if (!Number.isNaN(si)) goTo(si);
      });
    });
    paintBeads();
  }

  function beadKeyForStep(stepIdx) {
    const s = steps[stepIdx];
    if (!s) return null;
    if (s.kind === "pembuka" || s.kind === "tanda" || s.kind === "percaya") {
      if (s.title.indexOf("Penutup") >= 0) return "X";
      // opening tanda/percaya -> X as well
      if (s.kind !== "pembuka") return "X";
      return "X";
    }
    if (s.kind === "bapa" && s.kicker === "Doa awal") return "P0";
    if (s.kind === "salam3") {
      const m = s.sub.match(/\((\d)\/3\)/);
      return "P" + (m ? parseInt(m[1], 10) : 1);
    }
    if ((s.kind === "kemuliaan" || s.kind === "terpujilah") && s.kicker === "Doa awal") return "P4";
    // decades
    const mk = (s.sub || "").match(/(\d)\/5/);
    const d = mk ? parseInt(mk[1], 10) - 1 : 0;
    const base = d * 11;
    if (s.kind === "umum") return "L" + base; // announce at the big bead
    if (s.kind === "bapa") return "L" + base;
    if (s.kind === "salam") {
      const jm = (s.sub || "").match(/butir (\d+)\/10/);
      const j = jm ? parseInt(jm[1], 10) : 1;
      return "L" + (base + j);
    }
    if (s.kind === "kemuliaan" || s.kind === "terpujilah" || s.kind === "fatima") return "L" + ((base + 11) % 55);
    if (s.kind === "ratu" || s.kind === "doakanlah" || s.kind === "marilah") return "C";
    return "X";
  }

  function paintBeads() {
    const all = window.__beads || {};
    // reset classes; assign step to each bead (first step using it)
    Object.values(all).forEach((el) => {
      el.classList.remove("bead-done", "bead-now");
      el.dataset.step = "";
    });
    steps.forEach((s, i) => {
      const k = beadKeyForStep(i);
      const el = all[k];
      if (el && el.dataset.step === "") el.dataset.step = String(i);
    });
    steps.forEach((s, i) => {
      const k = beadKeyForStep(i);
      const el = all[k];
      if (!el) return;
      if (i < state.pos) el.classList.add("bead-done");
      if (i === state.pos) el.classList.add("bead-now");
    });
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
      el.className = "pray-p";
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

  /* ---------- Setup modal ---------- */
  function openSetup() {
    $("#setupModal").classList.remove("hidden");
    syncSetupUI();
  }
  function closeSetup() { $("#setupModal").classList.add("hidden"); }
  function syncSetupUI() {
    document.querySelectorAll('input[name="mode"]').forEach((r) => (r.checked = r.value === state.mode));
    const mc = $("#mysteryChoice");
    mc.value = state.mystery;
    $("#userCount").value = state.users.length;
    $("#leaderInput").value = state.leader || "";
    renderNameInputs();
    $("#groupOpts").style.display = state.mode === "group" ? "" : "none";
  }
  function renderNameInputs() {
    const wrap = $("#nameList");
    wrap.innerHTML = "";
    state.users.forEach((nm, i) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2";
      const lab = document.createElement("span");
      lab.className = "w-8 text-xs text-slate-400";
      lab.textContent = i + 1;
      const inp = document.createElement("input");
      inp.value = nm;
      inp.className = "flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-amber-400";
      inp.placeholder = "Umat " + (i + 1);
      inp.addEventListener("input", () => { state.users[i] = inp.value.trim() || ("Umat " + (i + 1)); });
      row.appendChild(lab); row.appendChild(inp);
      wrap.appendChild(row);
    });
  }

  function wire() {
    $("#btnNext").addEventListener("click", next);
    $("#btnBack").addEventListener("click", back);
    $("#btnSetup").addEventListener("click", openSetup);
    $("#btnSetup2").addEventListener("click", openSetup);
    $("#setupClose").addEventListener("click", () => { closeSetup(); render(); });
    $("#mysteryChoice").addEventListener("change", (e) => {
      state.mystery = e.target.value; steps = buildSteps(state.mystery); state.pos = 0; render(); syncSetupUI();
    });
    document.querySelectorAll('input[name="mode"]').forEach((r) =>
      r.addEventListener("change", () => {
        state.mode = document.querySelector('input[name="mode"]:checked').value;
        $("#groupOpts").style.display = state.mode === "group" ? "" : "none";
        render();
      })
    );
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

  // init
  applyTheme();
  renderRosary();
  wire();
  render();
  // sync header select
  $("#mysterySelect").value = state.mystery;
  if (!localStorage.getItem(LS)) openSetup();
})();
