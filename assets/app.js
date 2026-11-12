/* Placement Prep — single-page app (hash routing, no build step). */
(function () {
  "use strict";

  const D = window.PREP_DATA;
  const INFO = window.COMPANY_INFO || {};
  const R = window.RESOURCES;
  const DIFF = { E: "Easy", M: "Medium", H: "Hard" };
  const CATS = D.categories;
  const CAT_SHORT = {
    "Big Tech / FAANG+": "Big Tech / FAANG+",
    "Indian product companies & startups (OA-heavy)": "Indian product & startups",
    "Service-based / Mass recruiters": "Service-based / Mass recruiters",
    "Banks, Payments & FinServ": "Banks, Payments & FinServ",
    "Infra / Storage / Security / Networking": "Infra / Security / Networking",
    "Semiconductors & Hardware": "Semiconductors & Hardware",
    "Quant / HFT / Trading": "Quant / HFT / Trading"
  };
  // Which cross-company pack to fall back on for each category (indexes into D.packs)
  const CAT_PACK = {
    "Indian product companies & startups (OA-heavy)": 2,
    "Quant / HFT / Trading": 3,
    "Service-based / Mass recruiters": 4
  };
  const app = document.getElementById("app");

  /* ---------- helpers ---------- */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "");
  const enc = encodeURIComponent;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

  const store = {
    get(k, d) { try { const v = localStorage.getItem("pp." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("pp." + k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
  };
  let solved = store.get("solved", {});
  const isSolved = lc => !!solved[lc];
  function toggleSolved(lc, on) {
    if (on) solved[lc] = Date.now(); else delete solved[lc];
    store.set("solved", solved);
  }
  let starred = store.get("starred", []);

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  window.appToast = toast;
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast("Copied to clipboard"); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Copied to clipboard"); } catch { toast("Copy failed"); }
      ta.remove();
    }
  }

  /* ---------- data model ---------- */
  function prob(lc) {
    const p = D.problems[lc];
    if (!p) return null;
    return { lc: +lc, title: p[0], diff: DIFF[p[1]], d: p[1], acc: p[2], topics: p[3].map(i => D.topics[i]), premium: !!p[4], url: `https://leetcode.com/problems/${p[5]}/` };
  }
  const companies = D.companies.map(c => ({ name: c.n, cats: c.c, total: c.t, q: c.q, set: new Set(c.q.map(x => x[0])) }));
  const byNorm = new Map(companies.map(c => [norm(c.name), c]));
  // aliases from curated info
  Object.entries(INFO).forEach(([name, inf]) => {
    const c = byNorm.get(norm(name));
    (inf.aliases || []).forEach(a => { if (c && !byNorm.has(norm(a))) byNorm.set(norm(a), c); });
  });
  // aliases from the data build (e.g. "Citi" -> Citigroup)
  Object.entries(D.aliases || {}).forEach(([a, target]) => { const c = byNorm.get(norm(target)); if (c && !byNorm.has(norm(a))) byNorm.set(norm(a), c); });
  // campus recruiters with no question data: name -> category
  const extras = new Map();
  (D.extras || []).forEach(([n, cat]) => { if (!byNorm.has(norm(n))) extras.set(norm(n), { name: n, cat }); });
  Object.entries(INFO).forEach(([n, inf]) => { if (!byNorm.has(norm(n)) && !extras.has(norm(n))) extras.set(norm(n), { name: n, cat: inf.category || "" }); });
  R.proxies.forEach(p => p.names.forEach(n => { if (!byNorm.has(norm(n)) && !extras.has(norm(n))) extras.set(norm(n), { name: n, cat: "" }); }));
  const extraNames = new Set([...extras.values()].map(e => e.name));
  const extraList = [...extras.values()].sort((a, b) => a.name.localeCompare(b.name));
  const LINKS = window.COMPANY_LINKS || {};

  function findCompany(name) { return byNorm.get(norm(name)) || null; }
  function findExtra(name) { return extras.get(norm(name)) || null; }
  // Curated details win; Wikidata-sourced links fill the gaps.
  function infoFor(name) {
    let cur = INFO[name];
    if (!cur) {
      const k = Object.keys(INFO).find(n => norm(n) === norm(name) || (INFO[n].aliases || []).some(a => norm(a) === norm(name)));
      cur = k ? INFO[k] : {};
    }
    const wd = LINKS[name] || {};
    return { site: wd.site, linkedin: wd.linkedin, x: wd.x, instagram: wd.instagram, facebook: wd.facebook, ...cur };
  }
  function proxyFor(name) { return R.proxies.find(p => p.names.some(n => norm(n) === norm(name))); }

  function searchCompanies(q, limit = 8) {
    const nq = norm(q); if (!nq) return [];
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const pool = companies.map(c => ({ name: c.name, count: c.q.length, has: true }))
      .concat([...extraNames].map(n => ({ name: n, count: 0, has: false })));
    const aliasHits = [];
    for (const [k, c] of byNorm) if (k !== norm(c.name) && k.startsWith(nq)) aliasHits.push(c.name);
    const scored = [];
    for (const it of pool) {
      const n = norm(it.name); let s = -1;
      if (n === nq) s = 100;
      else if (aliasHits.includes(it.name)) s = 90;
      else if (n.startsWith(nq)) s = 80;
      else if (it.name.toLowerCase().split(/[\s/().&-]+/).some(w => norm(w).startsWith(nq))) s = 70;
      else if (n.includes(nq)) s = 60;
      else if (words.length > 1 && words.every(w => n.includes(norm(w)))) s = 50;
      else { // loose subsequence match for typos like "flpkart"
        let i = 0; for (const ch of n) if (ch === nq[i]) i++;
        if (i === nq.length && nq.length >= 3) s = 20;
      }
      if (s >= 0) scored.push({ ...it, s: s + Math.min(it.count, 100) / 100 });
    }
    return scored.sort((a, b) => b.s - a.s).slice(0, limit);
  }

  function similarCompanies(c, k = 8) {
    return companies.filter(o => o !== c).map(o => {
      let inter = 0; for (const x of c.set) if (o.set.has(x)) inter++;
      return { c: o, inter, j: inter / (c.set.size + o.set.size - inter) };
    }).filter(x => x.inter > 0).sort((a, b) => b.j - a.j).slice(0, k);
  }

  function topicCounts(rows) {
    const m = new Map();
    rows.forEach(r => prob(r.lc).topics.forEach(t => m.set(t, (m.get(t) || 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }

  /* ---------- link builders ---------- */
  const slugify = s => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/&/g, "and").replace(/[.']/g, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const google = q => `https://www.google.com/search?q=${enc(q)}`;

  function orgDetails(name) {
    const inf = infoFor(name);
    const q = name.replace(/\s*\(.*?\)\s*/g, " ").trim();
    const L = (label, url, fallback) => url ? { label, url, search: false } : { label, url: fallback, search: true };
    return [
      L("Base Site", inf.site, google(`${q} official website`)),
      ...(inf.careers ? [L("Careers", inf.careers)] : []),
      L("LinkedIn", inf.linkedin, `https://www.linkedin.com/search/results/companies/?keywords=${enc(q)}`),
      L("Facebook", inf.facebook, `https://www.facebook.com/search/pages/?q=${enc(q)}`),
      L("X (Twitter)", inf.x, `https://x.com/search?q=${enc(q)}&f=user`),
      L("Instagram", inf.instagram, google(`${q} official instagram`))
    ];
  }
  function interviewRefs(name) {
    const q = name.replace(/\s*\(.*?\)\s*/g, " ").trim(); const s = slugify(q);
    return [
      { label: "Interview Experiences and Questions from GeeksForGeeks", url: `https://www.geeksforgeeks.org/tag/${s}/` },
      { label: "Interview Experiences and Questions from AmbitionBox", url: `https://www.ambitionbox.com/interviews/${s}-interview-questions` },
      { label: "LeetCode Discuss interview experiences", url: google(`site:leetcode.com/discuss ${q} interview experience`), search: true },
      { label: "Glassdoor interview questions", url: `https://www.glassdoor.co.in/Search/results.htm?keyword=${enc(q)}`, search: true },
      { label: "YouTube interview experiences", url: `https://www.youtube.com/results?search_query=${enc(q + " interview experience")}`, search: true },
      { label: "Reddit r/developersIndia threads", url: `https://www.reddit.com/r/developersIndia/search/?q=${enc(q + " interview")}`, search: true }
    ];
  }
  function highlights(name, cats, rows) {
    const inf = infoFor(name);
    const out = [], seen = new Set();
    const add = (label, url) => { if (url && !seen.has(url)) { seen.add(url); out.push({ label, url }); } };
    window.CORE_HIGHLIGHTS.forEach(([l, u]) => add(l, u));
    (inf.highlights || []).forEach(([l, u]) => add(l, u));
    (cats.length ? cats : [""]).forEach(c => (window.CATEGORY_HIGHLIGHTS[c] || []).forEach(([l, u]) => add(l, u)));
    if (rows.length) {
      topicCounts(rows).slice(0, 5).forEach(([t, n]) => add(`${t} (${n} of this company's questions)`, window.TOPIC_LINKS[t] || google(`geeksforgeeks ${t}`)));
      const top = [...rows].sort((a, b) => (b.recent - a.recent) || (b.freq - a.freq)).slice(0, 5);
      top.forEach(r => { const p = prob(r.lc); add(`${p.title}${r.recent ? " (asked recently)" : ""}`, p.url); });
    }
    return out;
  }
  function roleFor(name, cats) {
    const custom = store.get("roles", {})[name];
    if (custom) return custom;
    const inf = infoFor(name);
    if (inf.roles) return inf.roles.join(", ");
    return (window.CATEGORY_ROLES[cats[0] || ""] || window.CATEGORY_ROLES[""]).join(", ");
  }
  const PREP_NOTE = name => `Please look into all the interview references and look up YouTube experiences, as the highlights are not sufficient to cover all aspects of ${name} interview preparation.`;

  function whatsappText(name, cats, rows) {
    const lines = [`*ORGANIZATION*: ${name}`, "", "*ORGANIZATION DETAILS:*", ""];
    const det = orgDetails(name);
    det.forEach((d, i) => lines.push(`${i + 1}. ${d.label}: ${d.url}`));
    lines.push(`${det.length + 1}. Role/s Offered: ${roleFor(name, cats)}`, "", "*INTERVIEW REFERENCES*:", "");
    interviewRefs(name).forEach((r, i) => lines.push(`${i + 1}. ${r.label}: ${r.url}`, ""));
    lines.push("*INTERVIEW HIGHLIGHTS*:", "");
    highlights(name, cats, rows).forEach((h, i) => lines.push(`${i + 1}. ${h.label}: ${h.url}`));
    if (rows.length) {
      lines.push("", `*TOP CODING QUESTIONS* (${name}):`, "");
      [...rows].sort((a, b) => (b.recent - a.recent) || (b.freq - a.freq)).slice(0, 10).forEach((r, i) => {
        const p = prob(r.lc); lines.push(`${i + 1}. ${p.title} (${p.diff}): ${p.url}`);
      });
    }
    lines.push("", `NOTE: ${PREP_NOTE(name)}`);
    return lines.join("\n");
  }

  function linkListHTML(items) {
    return `<ol class="linklist">${items.map(it => `<li><span><span class="lbl">${esc(it.label)}:</span> <a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.search ? "Search " + it.label.replace(/^.*? from /, "") : it.url)}</a>${it.search ? '<span class="tag-search">search</span>' : ""}</span></li>`).join("")}</ol>`;
  }

  /* ---------- question table component ---------- */
  function questionTable(host, rows, opts = {}) {
    // rows: [{lc, freq?, recent?, companies?}]
    const st = { q: "", diffs: new Set(["E", "M", "H"]), recent: false, hidePrem: false, hideDone: false, topic: "", sort: opts.defaultSort || "n", dir: 1 };
    const data = rows.map((r, i) => ({ ...r, n: i + 1, p: prob(r.lc) }));
    const topics = topicCounts(rows).map(t => t[0]);
    const hasFreq = rows.some(r => r.freq != null);
    const hasCos = rows.some(r => r.companies != null);
    host.innerHTML = `
      <div class="toolbar">
        <input type="search" placeholder="Filter by title or LC number…" aria-label="Filter questions">
        <span class="chips">${["E", "M", "H"].map(d => `<button class="chip on" data-d="${d}">${DIFF[d]}</button>`).join("")}</span>
        <select aria-label="Topic"><option value="">All topics</option>${topics.map(t => `<option>${esc(t)}</option>`).join("")}</select>
        ${hasFreq ? `<label><input type="checkbox" data-f="recent"> Recent only</label>` : ""}
        <label><input type="checkbox" data-f="hidePrem"> Hide Premium</label>
        <label><input type="checkbox" data-f="hideDone"> Hide solved</label>
        ${opts.onPdf ? `<button class="btn sm ghost" data-act="pdf">⬇ PDF of this view</button>` : ""}
      </div>
      <p class="small muted count-line"></p>
      <div class="table-wrap"><table class="q">
        <thead><tr>
          <th title="Mark solved">✓</th><th data-s="n">#</th><th data-s="lc">LC</th><th data-s="title">Problem</th><th data-s="diff">Difficulty</th>
          ${hasFreq ? `<th data-s="freq">Freq</th>` : ""}${hasCos ? `<th data-s="companies" title="Number of companies asking it">Companies</th>` : ""}
          <th data-s="acc">Acc.</th><th class="topics">Topics</th>
        </tr></thead><tbody></tbody></table></div>`;
    const tbody = $("tbody", host), countLine = $(".count-line", host);
    function filtered() {
      const nq = st.q.trim().toLowerCase();
      let list = data.filter(r => st.diffs.has(r.p.d)
        && (!st.recent || r.recent) && (!st.hidePrem || !r.p.premium) && (!st.hideDone || !isSolved(r.lc))
        && (!st.topic || r.p.topics.includes(st.topic))
        && (!nq || r.p.title.toLowerCase().includes(nq) || String(r.lc) === nq));
      const key = { n: r => r.n, lc: r => r.lc, title: r => r.p.title, diff: r => "EMH".indexOf(r.p.d), freq: r => -r.freq, companies: r => -r.companies, acc: r => r.p.acc ?? 101 }[st.sort];
      list.sort((a, b) => { const x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : 0) * st.dir; });
      return list;
    }
    function render() {
      const list = filtered();
      const done = list.filter(r => isSolved(r.lc)).length;
      countLine.textContent = `Showing ${list.length} of ${data.length} · ${done} solved in this view`;
      tbody.innerHTML = list.length ? list.map(r => {
        const p = r.p;
        return `<tr class="${r.recent ? "recent" : ""} ${isSolved(r.lc) ? "done" : ""}">
          <td><input type="checkbox" class="chk" data-lc="${r.lc}" ${isSolved(r.lc) ? "checked" : ""} aria-label="Mark ${esc(p.title)} solved"></td>
          <td class="num">${r.n}</td><td class="num">${r.lc}</td>
          <td class="title"><a href="${p.url}" target="_blank" rel="noopener">${esc(p.title)}</a>${r.recent ? '<span class="new">RECENT</span>' : ""}${p.premium ? '<span class="prem">Premium</span><a class="alt" target="_blank" rel="noopener" href="' + google("geeksforgeeks " + p.title) + '">free alt ↗</a>' : ""}</td>
          <td><span class="diff ${p.d}">${p.diff}</span></td>
          ${hasFreq ? `<td class="num"><span class="freqbar"><i style="width:${Math.max(4, r.freq)}%"></i></span>${r.freq}</td>` : ""}
          ${hasCos ? `<td class="num">${r.companies ?? ""}</td>` : ""}
          <td class="num">${p.acc != null ? p.acc + "%" : "–"}</td>
          <td class="topics">${esc(p.topics.join(", "))}</td></tr>`;
      }).join("") : `<tr><td colspan="9" class="empty">No questions match these filters.</td></tr>`;
    }
    $("input[type=search]", host).addEventListener("input", e => { st.q = e.target.value; render(); });
    $("select", host).addEventListener("change", e => { st.topic = e.target.value; render(); });
    $$("button[data-d]", host).forEach(b => b.addEventListener("click", () => {
      const d = b.dataset.d; st.diffs.has(d) ? st.diffs.delete(d) : st.diffs.add(d); b.classList.toggle("on"); render();
    }));
    $$("input[data-f]", host).forEach(i => i.addEventListener("change", () => { st[i.dataset.f] = i.checked; render(); }));
    $$("th[data-s]", host).forEach(th => th.addEventListener("click", () => {
      const s = th.dataset.s; st.dir = st.sort === s ? -st.dir : 1; st.sort = s; render();
    }));
    tbody.addEventListener("change", e => {
      if (!e.target.matches(".chk")) return;
      toggleSolved(e.target.dataset.lc, e.target.checked);
      e.target.closest("tr").classList.toggle("done", e.target.checked);
      opts.onChange && opts.onChange();
      if (st.hideDone) render(); else {
        const list = filtered(); countLine.textContent = `Showing ${list.length} of ${data.length} · ${list.filter(r => isSolved(r.lc)).length} solved in this view`;
      }
    });
    const pdfBtn = $("[data-act=pdf]", host);
    if (pdfBtn) pdfBtn.addEventListener("click", () => opts.onPdf(filtered()));
    render();
    return { setTopic(t) { st.topic = t; $("select", host).value = t; render(); } };
  }

  const toPdfRows = list => list.map(r => {
    const p = r.p || prob(r.lc);
    return { lc: p.lc, title: p.title, diff: p.diff, freq: r.freq ?? "", companies: r.companies, acc: p.acc, topics: p.topics.join(", "), recent: !!r.recent, premium: p.premium, url: p.url };
  });

  /* ---------- views ---------- */
  function searchBox(placeholder = "Type a company name — e.g. Amazon, Aveva, Flipkart, TCS…") {
    return `<div class="search-wrap"><span class="icon">🔍</span>
      <input id="company-search" type="search" autocomplete="off" placeholder="${esc(placeholder)}" aria-label="Search company">
      <div class="suggest hidden" role="listbox"></div></div>`;
  }
  function wireSearch(root) {
    const input = $("#company-search", root), box = $(".suggest", root);
    if (!input) return;
    let sel = -1, items = [];
    const go = name => { location.hash = "#/c/" + enc(name); };
    function draw() {
      const v = input.value.trim();
      items = searchCompanies(v);
      if (!v) { box.classList.add("hidden"); return; }
      const exact = items.some(i => norm(i.name) === norm(v));
      const rows = items.map((it, i) => `<button type="button" data-name="${esc(it.name)}" class="${i === sel ? "sel" : ""}"><span>${esc(it.name)}</span><span class="cnt">${it.has ? plural(it.count, "question") : "no LeetCode data"}</span></button>`);
      if (!exact) rows.push(`<button type="button" data-name="${esc(v)}" class="${sel === items.length ? "sel" : ""}"><span>Build prep sheet for “${esc(v)}”</span><span class="cnt">links + category pack</span></button>`);
      box.innerHTML = rows.join(""); box.classList.remove("hidden");
    }
    input.addEventListener("input", () => { sel = -1; draw(); });
    input.addEventListener("keydown", e => {
      const n = $$("button", box).length;
      if (e.key === "ArrowDown") { sel = Math.min(n - 1, sel + 1); draw(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
      else if (e.key === "Enter") {
        const b = $$("button", box)[sel < 0 ? 0 : sel];
        if (b) go(b.dataset.name); else if (input.value.trim()) go(input.value.trim());
      } else if (e.key === "Escape") box.classList.add("hidden");
    });
    box.addEventListener("click", e => { const b = e.target.closest("button"); if (b) go(b.dataset.name); });
    document.addEventListener("click", e => { if (!root.contains(e.target)) box.classList.add("hidden"); }, { once: false });
    input.focus({ preventScroll: true });
  }

  function problemOfTheDay() {
    const pack = D.packs[0].q;
    const day = Math.floor(Date.now() / 864e5);
    return prob(pack[(day * 37) % pack.length][0]);
  }

  function viewHome() {
    const totalSolved = Object.keys(solved).filter(k => D.problems[k]).length;
    const popular = ["Amazon", "Microsoft", "Google", "Flipkart", "Goldman Sachs", "Oracle", "Infosys", "TCS", "Adobe", "Aveva"];
    const potd = problemOfTheDay();
    const catCount = c => companies.filter(x => x.cats.includes(c)).length + extraList.filter(e => e.cat === c).length;
    const first = n => /[a-z]/i.test(n[0]) ? n[0].toUpperCase() : "#";
    const letters = [...new Set(companies.map(c => first(c.name)).concat(extraList.map(e => first(e.name))))].sort();
    const starredHTML = starred.length ? `<section class="section"><div class="section-head"><h2>Your tracked companies</h2><a href="#/progress">View progress →</a></div>
      <div class="grid grid-4">${starred.map(n => {
        const c = findCompany(n); const tot = c ? c.q.length : 0; const done = c ? c.q.filter(x => isSolved(x[0])).length : 0;
        return `<a class="card cat-card" href="#/c/${enc(n)}"><h3>${esc(n)}</h3><div class="progress"><i style="width:${tot ? done / tot * 100 : 0}%"></i></div><p class="small muted">${done}/${tot} solved</p></a>`;
      }).join("")}</div></section>` : "";

    app.innerHTML = `
      <section class="hero">
        <h1>Prepare for any company that visits campus</h1>
        <p>Enter a company name to get its prep sheet — official links, interview references, highlights — plus every reported LeetCode question, downloadable as a PDF.</p>
        ${searchBox()}
        <div class="quick">${popular.map(n => `<a href="#/c/${enc(n)}">${esc(n)}</a>`).join("")}</div>
        <div class="hero-stats">
          <div><strong>${companies.length + extraList.length}</strong><span>companies</span></div>
          <div><strong>${companies.length}</strong><span>with question lists</span></div>
          <div><strong>${D.meta.problems.toLocaleString()}</strong><span>unique problems</span></div>
          <div><strong>${D.packs.length}</strong><span>prep packs</span></div>
          <div><strong>${totalSolved}</strong><span>solved by you</span></div>
        </div>
      </section>

      ${starredHTML}

      <section class="section grid grid-2">
        <div class="card accent">
          <h3>🔥 Problem of the day</h3>
          <p><a href="${potd.url}" target="_blank" rel="noopener"><strong>${esc(potd.title)}</strong></a> <span class="diff ${potd.d}">${potd.diff}</span></p>
          <p class="small muted">${esc(potd.topics.join(", "))} · from the Top 150 most-asked list</p>
          <label class="small"><input type="checkbox" class="chk" id="potd" ${isSolved(potd.lc) ? "checked" : ""}> Mark solved</label>
        </div>
        <div class="card accent">
          <h3>📅 Interview in a few days?</h3>
          <p class="muted">Generate a day-by-day plan from a company's recent and most-frequent questions plus core-subject revision.</p>
          <a class="btn orange" href="#/planner">Open study planner</a>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Browse by hiring type</h2><span class="muted small">Each type has a different OA pattern — see Resources.</span></div>
        <div class="grid grid-3">
          ${CATS.map((c, i) => `<a class="card cat-card" href="#/cat/${i}"><h3>${esc(CAT_SHORT[c])}</h3><span class="count">${catCount(c)}</span> <span class="muted small">companies</span></a>`).join("")}
          <a class="card cat-card" href="#/cat/other"><h3>Other companies</h3><span class="count">${companies.filter(c => !c.cats.length).length + extraList.filter(e => !e.cat).length}</span> <span class="muted small">companies</span></a>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Cross-company prep packs</h2><a href="#/packs">All packs →</a></div>
        <div class="grid grid-3">${D.packs.slice(0, 3).map((p, i) => `<a class="card cat-card" href="#/packs/${i}"><h3>${esc(p.n)}</h3><p class="small muted">${esc(p.d)}</p></a>`).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>All companies A–Z</h2><button class="btn sm ghost" id="dir-pdf">⬇ Company directory PDF</button></div>
        <p class="small muted">Number = reported questions. Companies marked “–” have no question list yet; their page uses the closest prep pack.</p>
        <div class="chips" id="az">${letters.map((l, i) => `<button class="chip ${i === 1 ? "on" : ""}" data-l="${l}">${l}</button>`).join("")}</div>
        <div class="chips" id="azlist" style="margin-top:12px"></div>
      </section>`;

    wireSearch(app);
    $("#potd").addEventListener("change", e => { toggleSolved(potd.lc, e.target.checked); toast(e.target.checked ? "Nice! Marked solved" : "Unmarked"); });
    const drawAZ = l => {
      const items = companies.filter(c => first(c.name) === l).map(c => [c.name, c.q.length])
        .concat(extraList.filter(e => first(e.name) === l).map(e => [e.name, "–"]))
        .sort((a, b) => a[0].localeCompare(b[0]));
      $("#azlist").innerHTML = items.map(([n, k]) => `<a class="chip" href="#/c/${enc(n)}">${esc(n)} <span class="muted">${k}</span></a>`).join("");
      $$("#az button").forEach(b => b.classList.toggle("on", b.dataset.l === l));
    };
    $("#az").addEventListener("click", e => { const b = e.target.closest("button"); if (b) drawAZ(b.dataset.l); });
    drawAZ(letters.includes("A") ? "A" : letters[0]);
    $("#dir-pdf").addEventListener("click", () => {
      const all = companies.map(c => ({ name: c.name, cats: c.cats, count: c.q.length }))
        .concat(extraList.map(e => ({ name: e.name, cats: e.cat ? [e.cat] : [], count: 0 })))
        .sort((a, b) => a.name.localeCompare(b.name));
      window.buildDirectoryPdf(all.map(x => {
        const inf = infoFor(x.name);
        return { name: x.name, type: x.cats.map(k => CAT_SHORT[k]).join(", ") || "Other", count: x.count, site: inf.site || "", linkedin: inf.linkedin || "" };
      }));
    });
  }

  function viewCategory(id) {
    const cat = id === "other" ? null : CATS[+id];
    const list = companies.filter(c => cat ? c.cats.includes(cat) : !c.cats.length).sort((a, b) => b.q.length - a.q.length);
    const noData = extraList.filter(e => cat ? e.cat === cat : !e.cat);
    const packIdx = cat ? CAT_PACK[cat] : undefined;
    const oa = R.oaFormats.find(o => cat && cat.toLowerCase().includes(o[0].split(" ")[0].toLowerCase()));
    app.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> / Hiring type</div>
      <h1>${esc(cat ? CAT_SHORT[cat] : "Other companies")}</h1>
      <p class="muted">${list.length + noData.length} companies. ${list.length} have question lists, sorted by number of reported questions.</p>
      ${oa ? `<div class="note"><strong>Typical OA:</strong> ${esc(oa[1])}. <strong>Focus:</strong> ${esc(oa[2])}.</div>` : ""}
      ${packIdx != null ? `<p style="margin-top:12px"><a class="btn orange" href="#/packs/${packIdx}">Open the ${esc(D.packs[packIdx].n)}</a></p>` : ""}
      <div class="grid grid-4 section">${list.map(c => {
        const done = c.q.filter(x => isSolved(x[0])).length;
        const rec = c.q.filter(x => x[2]).length;
        return `<a class="card cat-card" href="#/c/${enc(c.name)}"><h3>${esc(c.name)}</h3><p class="small muted">${plural(c.q.length, "question")}${rec ? ` · <span style="color:var(--hard)">${rec} recent</span>` : ""}</p><div class="progress"><i style="width:${done / c.q.length * 100}%"></i></div></a>`;
      }).join("")}</div>
      ${noData.length ? `<section class="section"><h2>Also recruits — no question list yet</h2>
        <p class="small muted">Their pages give the full prep sheet with questions from the closest prep pack.</p>
        <div class="chips">${noData.map(e => `<a class="chip" href="#/c/${enc(e.name)}">${esc(e.name)}</a>`).join("")}</div></section>` : ""}`;
  }

  function viewCompany(rawName) {
    const c = findCompany(rawName);
    const ex = c ? null : findExtra(rawName);
    const name = c ? c.name : ex ? ex.name : rawName.trim();
    const inf = infoFor(name);
    const customCats = store.get("customCat", {});
    let cats = c ? c.cats : (inf.category ? [inf.category] : ex?.cat ? [ex.cat] : (customCats[name] ? [customCats[name]] : []));
    if (c && !cats.length && inf.category) cats = [inf.category];
    const proxy = proxyFor(name);
    // Question source: company data, or a fallback pack
    let rows, source;
    if (c) {
      rows = c.q.map(([lc, freq, recent]) => ({ lc, freq, recent }));
      source = "company";
    } else {
      const pi = proxy?.pack ?? CAT_PACK[cats[0]] ?? 0;
      rows = D.packs[pi].q.map(([lc, companies]) => ({ lc, companies }));
      source = D.packs[pi].n;
    }
    const counts = { E: 0, M: 0, H: 0 }; rows.forEach(r => counts[prob(r.lc).d]++);
    const recent = rows.filter(r => r.recent).length;
    const doneCount = () => rows.filter(r => isSolved(r.lc)).length;
    const isStar = starred.includes(name);
    const det = orgDetails(name), refs = interviewRefs(name), hl = highlights(name, cats, c ? rows : []);
    const sim = c ? similarCompanies(c) : [];
    const tc = topicCounts(rows).slice(0, 12);
    const maxT = tc[0]?.[1] || 1;

    app.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> / ${cats[0] ? `<a href="#/cat/${CATS.indexOf(cats[0])}">${esc(CAT_SHORT[cats[0]])}</a> / ` : ""}${esc(name)}</div>
      <div class="company-head">
        <div>
          <h1>${esc(name)}</h1>
          <div class="chips">${cats.map(k => `<span class="chip navy">${esc(CAT_SHORT[k] || k)}</span>`).join("")}
            ${c ? `<span class="chip">${c.total > c.q.length ? `top ${c.q.length} of ${c.total} reported` : plural(c.q.length, "question")}</span>` : `<span class="chip orange">No company-tagged LeetCode data</span>`}</div>
        </div>
        <div class="actions">
          <button class="btn orange" data-act="pdf">⬇ Download PDF</button>
          <button class="btn ghost" data-act="wa" title="Copy in the WhatsApp prep-message format">📋 Copy prep message</button>
          <button class="btn ghost" data-act="star">${isStar ? "★ Tracking" : "☆ Track"}</button>
        </div>
      </div>

      ${!c ? `<div class="note">
          <strong>${esc(name)}</strong> has no reliable company-tagged question list${proxy ? ` (type: ${esc(proxy.type)})` : ""}. The questions below come from the <strong>${esc(source)}</strong>${proxy ? `; also practise lists of ${proxy.use.map(u => findCompany(u) ? `<a href="#/c/${enc(u)}">${esc(u)}</a>` : esc(u)).join(", ")}` : ""}.
          Then read recent experiences on GfG, LeetCode Discuss and YouTube 2–3 weeks before the test.
          ${!inf.category && !proxy && !ex?.cat ? `<div style="margin-top:8px">What kind of company is it?
            <select class="field" id="setcat"><option value="">Not sure (general Top 150)</option>${CATS.map(k => `<option ${cats[0] === k ? "selected" : ""} value="${esc(k)}">${esc(CAT_SHORT[k])}</option>`).join("")}</select></div>` : ""}
        </div>` : c.q.length < 10 ? `<div class="note">Only ${plural(c.q.length, "question")} reported for ${esc(name)}. After these, practise the ${cats[0] && CAT_PACK[cats[0]] != null ? `<a href="#/packs/${CAT_PACK[cats[0]]}">${esc(D.packs[CAT_PACK[cats[0]]].n)}</a>` : `<a href="#/packs/0">Top 150 most-asked</a>`}${sim.length ? ` and similar companies like <a href="#/c/${enc(sim[0].c.name)}">${esc(sim[0].c.name)}</a>` : ""}.</div>` : ""}

      <div class="stats">
        <div class="stat"><strong>${rows.length}</strong><span>${c ? "questions listed" : "pack questions"}</span></div>
        <div class="stat e"><strong>${counts.E}</strong><span>Easy</span></div>
        <div class="stat m"><strong>${counts.M}</strong><span>Medium</span></div>
        <div class="stat h"><strong>${counts.H}</strong><span>Hard</span></div>
        ${c ? `<div class="stat r"><strong>${recent}</strong><span>asked in last 6 months</span></div>` : ""}
        <div class="stat"><strong id="donecount">${doneCount()}</strong><span>solved by you</span><div class="progress" style="margin-top:6px"><i id="donebar" style="width:${doneCount() / rows.length * 100}%"></i></div></div>
      </div>

      <div class="tabs" role="tablist">
        <button class="on" data-tab="sheet">Prep sheet</button>
        <button data-tab="questions">Questions (${rows.length})</button>
        <button data-tab="insights">Topics & similar companies</button>
      </div>

      <div data-pane="sheet">
        <div class="grid grid-2">
          <div class="card accent">
            <h3>Organization details</h3>
            ${linkListHTML(det)}
            <p style="margin:10px 0 0"><span class="lbl" style="font-weight:600">Role/s Offered:</span>
              <input class="role-input" id="role" value="${esc(roleFor(name, cats))}" title="Edit to match the placement notice — saved in this browser"></p>
            <p class="small muted" style="margin:4px 0 0">${infoFor(name).roles ? "" : "Typical roles for this kind of company. "}Edit to match the placement notice.</p>
            <p class="small muted" style="margin:4px 0 0">Links come from a curated list${LINKS[name] ? ` and <a href="https://www.wikidata.org/wiki/${esc(LINKS[name].wd)}" target="_blank" rel="noopener">Wikidata</a>` : ""}. Ones marked “search” weren't found — check the result before using it.</p>
          </div>
          <div class="card accent">
            <h3>Interview references</h3>
            ${linkListHTML(refs)}
          </div>
        </div>
        <div class="card accent section">
          <h3>Interview highlights</h3>
          ${linkListHTML(hl)}
          <div class="note"><strong>NOTE:</strong> ${esc(PREP_NOTE(name))}</div>
        </div>
      </div>

      <div data-pane="questions" class="hidden">
        ${c ? `<p class="small muted">Red titles were reported in the last 6 months — do these first, then the top 20–30 by Freq (100 = ${esc(name)}'s most-reported problem). Ticks are saved in this browser and shared across companies.</p>` : ""}
        <div id="qt"></div>
      </div>

      <div data-pane="insights" class="hidden">
        <div class="grid grid-2">
          <div class="card">
            <h3>Most-tested topics</h3>
            <p class="small muted">Click a topic to filter the question list.</p>
            <div class="bars">${tc.map(([t, n]) => `<div class="bar" data-topic="${esc(t)}" style="cursor:pointer"><span class="name" title="${esc(t)}">${esc(t)}</span><span class="track"><span class="fill" style="display:block;width:${n / maxT * 100}%"></span></span><span class="v">${n}</span></div>`).join("")}</div>
          </div>
          <div class="card">
            <h3>${c ? "Companies with overlapping questions" : "Also practise"}</h3>
            ${c ? (sim.length ? `<p class="small muted">Their lists share the most problems with ${esc(name)} — good extra practice.</p>
              <ol class="linklist">${sim.map(s => `<li><span><a href="#/c/${enc(s.c.name)}">${esc(s.c.name)}</a> <span class="muted small">· ${s.inter} shared · <a href="#/compare/${enc(name)}/${enc(s.c.name)}">compare</a></span></span></li>`).join("")}</ol>` : `<p class="muted">No overlaps found.</p>`)
              : `<ol class="linklist">${(proxy ? proxy.use : []).map(u => `<li><span>${findCompany(u) ? `<a href="#/c/${enc(u)}">${esc(u)}</a>` : esc(u)}</span></li>`).join("")}${D.packs.map((p, i) => `<li><span><a href="#/packs/${i}">${esc(p.n)}</a></span></li>`).join("")}</ol>`}
          </div>
        </div>
      </div>`;

    const updateDone = () => { const d = doneCount(); $("#donecount").textContent = d; $("#donebar").style.width = d / rows.length * 100 + "%"; };
    const pdfCtx = list => ({
      name, fileName: `${name}_Interview_Prep`,
      subtitle: `${cats.map(k => CAT_SHORT[k] || k).join(" · ") || "Company"} · ${c ? "Company-tagged LeetCode questions" : "Questions from " + source} · generated ${new Date().toLocaleDateString("en-IN")}`,
      details: det.map(d => [d.label, d.url]), roles: $("#role").value,
      references: refs.map(r => [r.label, r.url]), highlights: hl.map(h => [h.label, h.url]),
      note: "NOTE: " + PREP_NOTE(name), questions: toPdfRows(list),
      questionsTitle: c ? `${name} coding questions (${list.length})` : list.length === rows.length ? source : `${source} — filtered (${list.length})`
    });
    const table = questionTable($("#qt"), rows, { onChange: updateDone, onPdf: list => window.buildCompanyPdf(pdfCtx(list)) });

    const showTab = t => { $$(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === t)); $$("[data-pane]").forEach(p => p.classList.toggle("hidden", p.dataset.pane !== t)); };
    $(".tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showTab(b.dataset.tab); });
    $$(".bar[data-topic]").forEach(b => b.addEventListener("click", () => { table.setTopic(b.dataset.topic); showTab("questions"); }));
    $("[data-act=pdf]").addEventListener("click", () => window.buildCompanyPdf(pdfCtx(rows.map(r => ({ ...r, p: prob(r.lc) })))));
    $("[data-act=wa]").addEventListener("click", () => copyText(whatsappText(name, cats, c ? rows : [])));
    $("[data-act=star]").addEventListener("click", e => {
      starred = starred.includes(name) ? starred.filter(n => n !== name) : [...starred, name];
      store.set("starred", starred); e.target.textContent = starred.includes(name) ? "★ Tracking" : "☆ Track";
      toast(starred.includes(name) ? `Tracking ${name}` : "Removed from tracked");
    });
    $("#role").addEventListener("change", e => { const r = store.get("roles", {}); r[name] = e.target.value.trim(); if (!r[name]) delete r[name]; store.set("roles", r); toast("Role saved"); });
    const setcat = $("#setcat");
    if (setcat) setcat.addEventListener("change", () => { const m = store.get("customCat", {}); m[name] = setcat.value; store.set("customCat", m); viewCompany(name); });
  }

  function viewPacks(id) {
    if (id == null) {
      app.innerHTML = `<div class="crumbs"><a href="#/">Home</a> / Prep packs</div><h1>Cross-company prep packs</h1>
        <p class="muted">Built from all ${D.meta.companies} companies. Use these when a company has little data, or when you have only 2–3 weeks.</p>
        <div class="grid grid-2 section">${D.packs.map((p, i) => {
          const done = p.q.filter(x => isSolved(x[0])).length;
          return `<a class="card cat-card accent" href="#/packs/${i}"><h3>${esc(p.n)}</h3><p class="small muted">${esc(p.d)}</p><div class="progress"><i style="width:${done / p.q.length * 100}%"></i></div><p class="small muted">${done}/${p.q.length} solved</p></a>`;
        }).join("")}</div>`;
      return;
    }
    const p = D.packs[+id]; if (!p) return viewNotFound();
    const rows = p.q.map(([lc, companies]) => ({ lc, companies }));
    app.innerHTML = `<div class="crumbs"><a href="#/">Home</a> / <a href="#/packs">Prep packs</a></div>
      <div class="company-head"><div><h1>${esc(p.n)}</h1><p class="muted">${esc(p.d)} “Companies” = how many company lists include the problem.</p></div>
      <div class="actions"><button class="btn orange" data-act="pdf">⬇ Download PDF</button></div></div>
      <div id="qt" class="section"></div>`;
    const ctx = list => ({ name: p.n, subtitle: p.d, questions: toPdfRows(list), questionsTitle: list.length === rows.length ? p.n : `${p.n} — filtered (${list.length})` });
    questionTable($("#qt"), rows, { onPdf: list => window.buildCompanyPdf(ctx(list)) });
    $("[data-act=pdf]").addEventListener("click", () => window.buildCompanyPdf(ctx(rows)));
  }

  function companyInput(id, val = "") {
    return `<input class="field" id="${id}" list="co-list" value="${esc(val)}" placeholder="Company name" style="min-width:220px">`;
  }
  const datalist = () => `<datalist id="co-list">${companies.map(c => `<option value="${esc(c.name)}">`).join("")}</datalist>`;

  function viewPlanner() {
    const saved = store.get("plan", { company: "", days: 14, perDay: 4, core: true });
    app.innerHTML = `<div class="crumbs"><a href="#/">Home</a> / Study planner</div>
      <h1>Study planner</h1>
      <p class="muted">Orders a company's questions the way the PDF notes recommend: recent ones first, then by frequency, skipping what you've solved. Pads with the right prep pack if the company list is short, and rotates a core subject each day.</p>
      <div class="card toolbar">
        ${datalist()}<label>Company ${companyInput("pl-co", saved.company)}</label>
        <label>Days <input class="field" id="pl-days" type="number" min="1" max="90" value="${saved.days}" style="width:80px"></label>
        <label>Problems / day <input class="field" id="pl-per" type="number" min="1" max="15" value="${saved.perDay}" style="width:80px"></label>
        <label><input type="checkbox" id="pl-core" ${saved.core ? "checked" : ""}> Core-subject revision</label>
        <button class="btn orange" id="pl-go">Generate plan</button>
      </div>
      <div id="pl-out" class="section"></div>`;
    const gen = () => {
      const name = $("#pl-co").value.trim(), days = Math.max(1, Math.min(90, +$("#pl-days").value || 14)), per = Math.max(1, Math.min(15, +$("#pl-per").value || 4)), core = $("#pl-core").checked;
      store.set("plan", { company: name, days, perDay: per, core });
      const c = findCompany(name);
      if (!name) { $("#pl-out").innerHTML = `<p class="empty">Enter a company to plan for.</p>`; return; }
      let list = c ? [...c.q].sort((a, b) => (b[2] - a[2]) || (b[1] - a[1])).map(x => x[0]) : [];
      const pi = (c && CAT_PACK[c.cats[0]]) ?? (proxyFor(name)?.pack) ?? 0;
      const need = days * per;
      for (const [lc] of D.packs[pi].q) { if (list.length >= need * 2) break; if (!list.includes(lc)) list.push(lc); }
      list = list.filter(lc => !isSolved(lc)).slice(0, need);
      const subjects = R.core.map(s => s.name);
      const plan = [];
      for (let d = 0; d < days; d++) plan.push({ day: d + 1, qs: list.slice(d * per, d * per + per), subject: subjects[d % subjects.length] });
      const lastDays = Math.min(2, days);
      $("#pl-out").innerHTML = `
        <div class="section-head"><h2>${days}-day plan for ${esc(c ? c.name : name)}</h2>
        <span><button class="btn sm ghost" id="pl-copy">📋 Copy as text</button> <button class="btn sm orange" id="pl-pdf">⬇ PDF of plan questions</button></span></div>
        ${!c ? `<p class="note">No company data for “${esc(name)}” — the plan uses the ${esc(D.packs[pi].n)}.</p>` : ""}
        ${list.length < need ? `<p class="note">Only ${list.length} unsolved problems available — later days are for revision and mock OAs.</p>` : ""}
        <div class="grid grid-2">${plan.map((p, i) => `<div class="plan-day card"><h4>Day ${p.day}${i >= days - lastDays ? " · revise mistakes + mock OA" : ""}</h4>
          <ul>${p.qs.map(lc => { const q = prob(lc); return `<li><a href="${q.url}" target="_blank" rel="noopener">${esc(q.title)}</a> <span class="diff ${q.d}">${q.diff}</span></li>`; }).join("") || "<li class=muted>Revision / timed mock test</li>"}</ul>
          ${core ? `<p class="small muted" style="margin:6px 0 0">Core: ${esc(p.subject)}${(c?.cats[0] || "").startsWith("Service") && p.day % 2 ? " · 30 min aptitude (IndiaBix)" : ""}</p>` : ""}</div>`).join("")}</div>`;
      $("#pl-copy").addEventListener("click", () => copyText(plan.map(p => `Day ${p.day}:\n` + p.qs.map(lc => { const q = prob(lc); return `- ${q.title} (${q.diff}) ${q.url}`; }).join("\n") + (core ? `\n- Core: ${p.subject}` : "")).join("\n\n")));
      $("#pl-pdf").addEventListener("click", () => window.buildCompanyPdf({
        name: `${c ? c.name : name} – ${days}-day plan`, subtitle: `${per} problems/day · in plan order`, fileName: `${c ? c.name : name}_${days}_day_plan`,
        questions: toPdfRows(list.map(lc => { const r = c?.q.find(x => x[0] === lc); return { lc, freq: r ? r[1] : "", recent: r ? r[2] : 0 }; })), questionsTitle: "Plan questions (Day 1 first)"
      }));
    };
    $("#pl-go").addEventListener("click", gen);
    if (saved.company) gen();
  }

  function viewCompare(a = "", b = "") {
    app.innerHTML = `<div class="crumbs"><a href="#/">Home</a> / Compare</div><h1>Compare two companies</h1>
      <p class="muted">Interviewing at two places? Solve the shared problems first — they count twice.</p>
      <div class="card toolbar">${datalist()}${companyInput("cmp-a", a)}<span>vs</span>${companyInput("cmp-b", b)}<button class="btn orange" id="cmp-go">Compare</button></div>
      <div id="cmp-out" class="section"></div>`;
    const run = () => {
      const A = findCompany($("#cmp-a").value), B = findCompany($("#cmp-b").value);
      if (!A || !B) { $("#cmp-out").innerHTML = `<p class="empty">Pick two companies from the list.</p>`; return; }
      history.replaceState(null, "", `#/compare/${enc(A.name)}/${enc(B.name)}`);
      const shared = A.q.filter(x => B.set.has(x[0])).map(x => { const y = B.q.find(z => z[0] === x[0]); return { lc: x[0], freq: Math.round((x[1] + y[1]) / 2 * 10) / 10, recent: x[2] || y[2] }; }).sort((p, q) => q.freq - p.freq);
      $("#cmp-out").innerHTML = `<div class="stats">
          <div class="stat"><strong>${A.q.length}</strong><span>${esc(A.name)}</span></div>
          <div class="stat r"><strong>${shared.length}</strong><span>shared problems</span></div>
          <div class="stat"><strong>${B.q.length}</strong><span>${esc(B.name)}</span></div></div>
        <h2>Shared problems</h2><p class="small muted">Freq = average of both companies.</p><div id="cmp-t"></div>`;
      if (shared.length) questionTable($("#cmp-t"), shared, { onPdf: list => window.buildCompanyPdf({ name: `${A.name} + ${B.name}`, subtitle: "Problems asked at both companies", questions: toPdfRows(list) }) });
      else $("#cmp-t").innerHTML = `<p class="empty">No shared problems — prepare each list separately.</p>`;
    };
    $("#cmp-go").addEventListener("click", run);
    if (a && b) run();
  }

  function viewProgress() {
    const ids = Object.keys(solved).filter(k => D.problems[k]);
    const by = { E: 0, M: 0, H: 0 }; ids.forEach(k => by[D.problems[k][1]]++);
    const tot = { E: 0, M: 0, H: 0 }; Object.values(D.problems).forEach(p => tot[p[1]]++);
    const recentSolved = ids.sort((a, b) => solved[b] - solved[a]).slice(0, 15);
    const ranked = companies.map(c => ({ c, d: c.q.filter(x => isSolved(x[0])).length })).filter(x => x.d).sort((a, b) => b.d / b.c.q.length - a.d / a.c.q.length).slice(0, 12);
    const tracked = starred.map(n => ({ n, c: findCompany(n) }));
    app.innerHTML = `<div class="crumbs"><a href="#/">Home</a> / My progress</div><h1>My progress</h1>
      <p class="muted">Saved only in this browser. Export a backup to move it to another device.</p>
      <div class="stats">
        <div class="stat"><strong>${ids.length}</strong><span>solved of ${D.meta.problems}</span></div>
        <div class="stat e"><strong>${by.E}</strong><span>Easy / ${tot.E}</span></div>
        <div class="stat m"><strong>${by.M}</strong><span>Medium / ${tot.M}</span></div>
        <div class="stat h"><strong>${by.H}</strong><span>Hard / ${tot.H}</span></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><h3>Tracked companies</h3>${tracked.length ? tracked.map(({ n, c }) => {
          const t = c ? c.q.length : 0, d = c ? c.q.filter(x => isSolved(x[0])).length : 0;
          return `<p style="margin:10px 0 4px"><a href="#/c/${enc(n)}">${esc(n)}</a> <span class="muted small">${d}/${t}</span></p><div class="progress"><i style="width:${t ? d / t * 100 : 0}%"></i></div>`;
        }).join("") : `<p class="muted">Press “☆ Track” on a company page to follow it here.</p>`}</div>
        <div class="card"><h3>Best-covered companies</h3>${ranked.length ? ranked.map(({ c, d }) => `<p style="margin:10px 0 4px"><a href="#/c/${enc(c.name)}">${esc(c.name)}</a> <span class="muted small">${d}/${c.q.length}</span></p><div class="progress"><i style="width:${d / c.q.length * 100}%"></i></div>`).join("") : `<p class="muted">Tick problems as you solve them.</p>`}</div>
        <div class="card"><h3>Recently solved</h3>${recentSolved.length ? `<ol class="linklist">${recentSolved.map(k => { const p = prob(k); return `<li><span><a href="${p.url}" target="_blank" rel="noopener">${esc(p.title)}</a> <span class="diff ${p.d}">${p.diff}</span></span></li>`; }).join("")}</ol>` : `<p class="muted">Nothing yet.</p>`}</div>
        <div class="card"><h3>Backup</h3><p class="muted small">Export your ticks, tracked companies and saved roles as a file.</p>
          <p><button class="btn" id="exp">⬇ Export</button> <label class="btn ghost">⬆ Import<input type="file" id="imp" accept="application/json" hidden></label> <button class="btn ghost" id="rst">Reset</button></p></div>
      </div>`;
    $("#exp").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ solved, starred, roles: store.get("roles", {}), customCat: store.get("customCat", {}) }, null, 1)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "placement-prep-progress.json"; a.click(); URL.revokeObjectURL(a.href);
    });
    $("#imp").addEventListener("change", async e => {
      try {
        const j = JSON.parse(await e.target.files[0].text());
        solved = { ...solved, ...(j.solved || {}) }; store.set("solved", solved);
        starred = [...new Set([...starred, ...(j.starred || [])])]; store.set("starred", starred);
        store.set("roles", { ...store.get("roles", {}), ...(j.roles || {}) });
        store.set("customCat", { ...store.get("customCat", {}), ...(j.customCat || {}) });
        toast("Progress imported"); viewProgress();
      } catch { toast("That file isn't a valid backup"); }
    });
    $("#rst").addEventListener("click", () => {
      if (!confirm("Clear all solved ticks and tracked companies in this browser?")) return;
      solved = {}; starred = []; store.set("solved", solved); store.set("starred", starred); viewProgress();
    });
  }

  function viewResources() {
    const ll = arr => `<ol class="linklist">${arr.map(([l, u]) => `<li><span><a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a></span></li>`).join("")}</ol>`;
    app.innerHTML = `<div class="crumbs"><a href="#/">Home</a> / Resources</div><h1>Placement resources</h1>
      <p class="muted">Everything beyond company-wise coding questions: OA patterns, core CS subjects, aptitude, HR and resume.</p>

      <section class="section"><h2>Preparation timeline</h2><div class="grid grid-4">${R.timeline.map(([t, d]) => `<div class="card accent"><h3>${esc(t)}</h3><p class="small muted">${esc(d)}</p></div>`).join("")}</div></section>

      <section class="section"><h2>What OAs look like, by company type</h2>
        <div class="table-wrap"><table class="q"><thead><tr><th>Type</th><th>Typical format</th><th>Focus</th></tr></thead>
        <tbody>${R.oaFormats.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <div class="card section"><h3>OA habits that save marks</h3><ul class="clean">${R.oaHabits.map(h => `<li>${esc(h)}</li>`).join("")}</ul></div>
      </section>

      <section class="section"><h2>Companies with little or no data — what to practise instead</h2>
        <div class="table-wrap"><table class="q"><thead><tr><th>Company</th><th>Type</th><th>Prep with</th></tr></thead>
        <tbody>${R.proxies.map(p => `<tr><td>${p.names.map(n => `<a href="#/c/${enc(n)}">${esc(n)}</a>`).join(", ")}</td><td>${esc(p.type)}</td><td>${p.use.map(u => findCompany(u) ? `<a href="#/c/${enc(u)}">${esc(u)}</a>` : esc(u)).join(", ")}${p.pack != null ? ` + <a href="#/packs/${p.pack}">${esc(D.packs[p.pack].n.split(" (")[0])}</a>` : ""}</td></tr>`).join("")}</tbody></table></div>
      </section>

      <section class="section"><h2>Core CS subjects</h2><div class="grid grid-3">${R.core.map(s => `<div class="card"><h3>${esc(s.name)}</h3><p class="small muted">${esc(s.focus)}</p>${ll(s.links)}</div>`).join("")}</div></section>

      <section class="section grid grid-2">
        <div class="card"><h3>DSA sheets</h3>${ll(R.dsaSheets)}</div>
        <div class="card"><h3>Aptitude & MCQs</h3>${ll(R.aptitude)}</div>
        <div class="card"><h3>Interview experiences</h3>${ll(R.experiences)}</div>
        <div class="card"><h3>YouTube channels</h3>${ll(R.youtube)}</div>
      </section>

      <section class="section"><h2>HR & behavioural questions</h2>${R.hr.map(([q, a]) => `<details class="qa"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>

      <section class="section"><div class="card accent"><h3>Resume checklist</h3><ul class="clean">${R.resume.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div></section>`;
  }

  function viewNotFound() { app.innerHTML = `<div class="empty"><h2>Page not found</h2><p><a href="#/">Back to home</a></p></div>`; }

  /* ---------- router ---------- */
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
    const [p0, p1, p2] = parts;
    $$(".nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === ({ "": "home", c: "home", cat: "home" }[p0] ?? p0)));
    $(".nav").classList.remove("open");
    window.scrollTo(0, 0);
    if (!p0) viewHome();
    else if (p0 === "c" && p1) { viewCompany(p1); document.title = `${p1} · Placement Prep`; return; }
    else if (p0 === "cat") viewCategory(p1);
    else if (p0 === "packs") viewPacks(p1);
    else if (p0 === "planner") viewPlanner();
    else if (p0 === "compare") viewCompare(p1, p2);
    else if (p0 === "progress") viewProgress();
    else if (p0 === "resources") viewResources();
    else viewNotFound();
    document.title = "Placement Prep";
  }
  window.addEventListener("hashchange", route);

  /* ---------- chrome ---------- */
  const theme = store.get("theme", null);
  if (theme) document.documentElement.dataset.theme = theme;
  $(".theme-btn").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next; store.set("theme", next);
  });
  $(".nav-toggle").addEventListener("click", e => { const n = $(".nav"); n.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", n.classList.contains("open")); });

  route();
})();
