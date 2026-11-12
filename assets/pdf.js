/* Company-wise PDF export using jsPDF + jspdf-autotable (loaded from cdnjs). */
(function () {
  const NAVY = [11, 42, 91];
  const ORANGE = [243, 112, 33];
  const MUTED = [91, 103, 128];
  const DIFF_COLOR = { Easy: [30, 123, 52], Medium: [168, 98, 0], Hard: [179, 38, 30] };

  // Built-in PDF fonts only cover WinAnsi; swap characters they cannot draw.
  function clean(s) {
    return String(s ?? "")
      .replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/→/g, "->").replace(/←/g, "<-")
      .replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x00-\xFF–—•…€]/g, "");
  }

  const notify = msg => (window.appToast ? window.appToast(msg) : alert(msg));
  const LIB_MISSING = "PDF library didn't load. Refresh the page and try again.";

  /**
   * Save without relying on jsPDF's built-in saver. Normal browsers get a download;
   * iPhone/iPad and in-app browsers (WhatsApp, Instagram, …) block blob downloads,
   * so there the PDF opens in a new tab where it can be saved or shared.
   */
  function savePdf(doc, filename) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const ua = navigator.userAgent;
    const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line\/|Snapchat|; wv\)/i.test(ua);
    const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (inApp || iOS || !("download" in HTMLAnchorElement.prototype)) {
      const w = window.open(url, "_blank");
      if (!w) location.href = url;
      notify(inApp ? "PDF opened. If it doesn't, open this site in Chrome/Safari." : "PDF opened — use Share → Save to Files.");
    } else {
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.rel = "noopener"; a.style.display = "none";
      document.body.appendChild(a); a.click(); a.remove();
      notify("Downloading " + filename);
    }
    setTimeout(() => URL.revokeObjectURL(url), 120000);
  }

  // Run a PDF build, reporting any failure instead of failing silently.
  function guarded(fn) {
    return function (...args) {
      if (!window.jspdf || !window.jspdf.jsPDF || !window.jspdf.jsPDF.API.autoTable) { notify(LIB_MISSING); return; }
      try { fn(...args); } catch (e) { console.error(e); notify("Couldn't create the PDF: " + e.message); }
    };
  }

  function header(doc, title, subtitle) {
    const w = doc.internal.pageSize.getWidth();
    doc.setFillColor(...NAVY); doc.rect(0, 0, w, 74, "F");
    doc.setFillColor(...ORANGE); doc.rect(0, 74, w, 5, "F");
    doc.setFillColor(...ORANGE); doc.roundedRect(36, 20, 40, 34, 5, 5, "F");
    doc.setTextColor(255); doc.setFont("times", "bold"); doc.setFontSize(14); doc.text("PP", 56, 42, { align: "center" });
    doc.setFontSize(20); doc.text(clean(title), 88, 38);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(200, 214, 240);
    doc.text(clean(subtitle), 88, 55);
  }

  function footer(doc) {
    const n = doc.internal.getNumberOfPages();
    const w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
      doc.text("Placement Prep · Data: LeetCode Questions by Company, Dr. Animesh Giri", 36, h - 18);
      doc.text(`Page ${i} of ${n}`, w - 36, h - 18, { align: "right" });
    }
  }

  function sectionTitle(doc, y, text) {
    if (y > doc.internal.pageSize.getHeight() - 90) { doc.addPage(); y = 50; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...NAVY);
    doc.text(clean(text), 36, y);
    doc.setDrawColor(...ORANGE); doc.setLineWidth(1.5); doc.line(36, y + 5, 80, y + 5);
    return y + 20;
  }

  function linkList(doc, y, items) {
    const pageH = doc.internal.pageSize.getHeight();
    const maxW = doc.internal.pageSize.getWidth() - 72;
    items.forEach(([label, url], i) => {
      if (y > pageH - 50) { doc.addPage(); y = 50; }
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(30);
      const lead = `${i + 1}. ${clean(label)}: `;
      doc.text(lead, 40, y);
      const lw = doc.getTextWidth(lead);
      doc.setFont("helvetica", "normal"); doc.setTextColor(29, 79, 163);
      let u = clean(url);
      while (u.length > 10 && doc.getTextWidth(u) > maxW - lw) u = u.slice(0, -4) + "…";
      if (url) doc.textWithLink(u, 40 + lw, y, { url });
      y += 14;
    });
    return y + 6;
  }

  /**
   * ctx: { name, subtitle, details: [[label,url]], references: [[label,url]], highlights: [[label,url]],
   *        note, questions: [{lc,title,diff,freq,acc,topics,recent,premium,url}], extraTitle, extraRows }
   */
  window.buildCompanyPdf = guarded(function (ctx) {
    const doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });
    header(doc, ctx.name, ctx.subtitle);
    let y = 104;

    if (ctx.details?.length) { y = sectionTitle(doc, y, "Organization details"); y = linkList(doc, y, ctx.details); }
    if (ctx.roles) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(30);
      const lead = `${(ctx.details?.length || 0) + 1}. Role/s Offered: `;
      doc.text(lead, 40, y - 6);
      const lw = doc.getTextWidth(lead);
      doc.setFont("helvetica", "normal"); doc.text(clean(ctx.roles), 40 + lw, y - 6);
      y += 12;
    }
    if (ctx.references?.length) { y = sectionTitle(doc, y, "Interview references"); y = linkList(doc, y, ctx.references); }
    if (ctx.highlights?.length) { y = sectionTitle(doc, y, "Interview highlights"); y = linkList(doc, y, ctx.highlights); }
    if (ctx.note) {
      doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
      const lines = doc.splitTextToSize(clean(ctx.note), doc.internal.pageSize.getWidth() - 72);
      if (y + lines.length * 11 > doc.internal.pageSize.getHeight() - 50) { doc.addPage(); y = 50; }
      doc.text(lines, 36, y); y += lines.length * 11 + 10;
    }

    const qs = ctx.questions || [];
    y = sectionTitle(doc, y + 4, ctx.questionsTitle || `Coding questions (${qs.length})`);
    const showFreq = qs.some(q => q.freq !== "" && q.freq != null);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...MUTED);
    doc.text(showFreq
      ? "Red titles = reported in the last 6 months (do these first). Freq 100 = this company's most-reported problem. Titles are clickable."
      : "Cos. = number of companies whose lists include the problem. Titles are clickable.", 36, y - 6);
    const head = [["#", "LC", "Problem", "Difficulty", showFreq ? "Freq" : "Cos.", "Acc.", "Topics", "Done"]];
    const body = qs.map((q, i) => [
      i + 1, q.lc, clean(q.title) + (q.premium ? " (Premium)" : ""), q.diff,
      showFreq ? q.freq : (q.companies ?? ""), q.acc != null && q.acc !== "" ? q.acc + "%" : "", clean(q.topics), ""
    ]);
    doc.autoTable({
      head, body, startY: y, margin: { left: 36, right: 36, bottom: 40 },
      styles: { font: "helvetica", fontSize: 7.5, cellPadding: 3, valign: "middle", lineColor: [219, 226, 238], lineWidth: 0.4 },
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 251] },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 30 }, 2: { cellWidth: 160 }, 3: { cellWidth: 46 }, 4: { cellWidth: 30 }, 5: { cellWidth: 34 }, 7: { cellWidth: 26 } },
      didParseCell(data) {
        if (data.section !== "body") return;
        const q = qs[data.row.index];
        if (data.column.index === 2) {
          data.cell.styles.textColor = q.recent ? [179, 38, 30] : [29, 79, 163];
          if (q.recent) data.cell.styles.fontStyle = "bold";
        }
        if (data.column.index === 3) { data.cell.styles.textColor = DIFF_COLOR[q.diff]; data.cell.styles.fontStyle = "bold"; }
      },
      didDrawCell(data) {
        if (data.section !== "body") return;
        const q = qs[data.row.index];
        if (data.column.index === 2 && q.url) doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: q.url });
        if (data.column.index === 7) {
          doc.setDrawColor(150); doc.setLineWidth(0.6);
          doc.rect(data.cell.x + 8, data.cell.y + data.cell.height / 2 - 4, 8, 8);
        }
      }
    });

    footer(doc);
    const file = (ctx.fileName || ctx.name).replace(/[^\w.-]+/g, "_") + ".pdf";
    savePdf(doc, file);
  });

  /** rows: [{name, type, count, site, linkedin}] — one table of every company with clickable links. */
  window.buildDirectoryPdf = guarded(function (rows) {
    const doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });
    const withQ = rows.filter(r => r.count).length;
    header(doc, "Company Directory", `${rows.length} companies · ${withQ} with LeetCode question lists · generated ${new Date().toLocaleDateString("en-IN")}`);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
    doc.text(doc.splitTextToSize("Qs = reported LeetCode questions (\u2013 = none yet; use the matching prep pack). Website and LinkedIn come from curated entries and Wikidata; blank = not found, search on the site instead.", doc.internal.pageSize.getWidth() - 72), 36, 98);
    const short = u => clean(u).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    doc.autoTable({
      head: [["Company", "Type", "Qs", "Website", "LinkedIn"]],
      body: rows.map(r => [clean(r.name), clean(r.type), r.count || "\u2013", short(r.site), r.linkedin ? short(r.linkedin).replace(/^linkedin\.com\/company\//, "") : ""]),
      startY: 120, margin: { left: 36, right: 36, bottom: 40 },
      styles: { font: "helvetica", fontSize: 7.5, cellPadding: 3, lineColor: [219, 226, 238], lineWidth: 0.4, overflow: "ellipsize" },
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 251] },
      columnStyles: { 0: { cellWidth: 120, fontStyle: "bold" }, 1: { cellWidth: 110 }, 2: { cellWidth: 26, halign: "right" }, 3: { cellWidth: 140 }, 4: { cellWidth: 127 } },
      didParseCell(d) { if (d.section === "body" && (d.column.index === 3 || d.column.index === 4)) d.cell.styles.textColor = [29, 79, 163]; },
      didDrawCell(d) {
        if (d.section !== "body") return;
        const r = rows[d.row.index];
        const url = d.column.index === 3 ? r.site : d.column.index === 4 ? r.linkedin : null;
        if (url) doc.link(d.cell.x, d.cell.y, d.cell.width, d.cell.height, { url });
      }
    });
    footer(doc);
    savePdf(doc, "Company_Directory.pdf");
  });
})();
