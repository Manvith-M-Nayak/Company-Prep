import pymupdf, sys, json, re
doc = pymupdf.open(sys.argv[1])
out = {"companies": [], "packs": []}
cur = None  # current section dict with "rows"
cols = None
def new_section(kind, name):
    global cur
    name = re.sub(r"\s*\(cont(inued|\.)?\)\s*$", "", name).strip()
    if cur and cur["name"] == name: return
    cur = {"name": name, "rows": [], "meta": "", "category": "", "desc": ""}
    out["companies" if kind=="c" else "packs"].append(cur)

for pno in range(14, len(doc)):
    p = doc[pno]
    links = [(l["from"], l.get("uri")) for l in p.get_links() if l.get("uri")]
    spans = []
    for b in p.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            for s in l["spans"]:
                if s["text"].strip():
                    spans.append(s)
    spans.sort(key=lambda s: (round(s["bbox"][1]), s["bbox"][0]))
    lastrow = None
    for s in spans:
        t = s["text"].strip(); x = s["bbox"][0]; y = s["bbox"][1]; f = s["font"]; c = s["color"]; sz = s["size"]
        if "Page " in t and " of 335" in t: continue
        if y < 50: continue  # running header
        if f == "Georgia-Bold" and round(sz) == 13 and c == 0x1f2a44 and pno >= 28:
            new_section("c", t); cols=None; lastrow=None; continue
        if f == "Georgia-Bold" and round(sz) == 14 and pno < 28:
            new_section("p", t); cols=None; lastrow=None; continue
        if cur is None: continue
        if f.startswith("Arial-Italic") or f.startswith("Arial-BoldItalic"):
            if round(sz) == 8 and c == 0x5b6573:
                if "BoldItalic" in f: cur["category"] += t
                else: cur["meta"] += t
                continue
            if pno < 28 and not cur["rows"]:
                cur["desc"] += " " + t; continue
        if f == "Arial-BoldMT" and c == 0x1f2a44 and round(sz,1) == 7.3:
            cols = cols or {}
            cols[t] = x; continue
        if not cols or round(sz,1) not in (7.3, 6.3): continue
        # assign column
        names = sorted(cols.items(), key=lambda kv: kv[1])
        col = None
        for i,(n,cx) in enumerate(names):
            nx = names[i+1][1] if i+1 < len(names) else 1e9
            lo = cx - (12 if n in ("Freq","Companies","Acc.") else 2)
            if n == "#": lo = 0
            if x >= lo - 0.5 and x < nx - (12 if names[i+1][0] in ("Freq","Companies","Acc.") else 2) if i+1 < len(names) else x>=lo:
                col = n
        if col is None:
            # fallback nearest left
            col = max((n for n,cx in names if cx <= x+12), key=lambda n: cols[n], default=None)
        if col == "#" and t.isdigit():
            lastrow = {"n": int(t), "lc": "", "title": "", "diff": "", "freq": "", "acc": "", "topics": "", "companies": "", "recent": False, "premium": False, "url": "", "y": y}
            cur["rows"].append(lastrow); continue
        if lastrow is None: continue
        if t == "Premium" and "Italic" in f: lastrow["premium"] = True; continue
        key = {"LC":"lc","Problem":"title","Difficulty":"diff","Freq":"freq","Acc.":"acc","Topics":"topics","Companies":"companies"}.get(col)
        if not key: continue
        if key == "title":
            if c == 0xb3261e: lastrow["recent"] = True
            if not lastrow["url"]:
                for r,u in links:
                    if r.x0 - 2 <= x <= r.x1 and r.y0 - 3 <= y <= r.y1 + 1 and "leetcode.com" in u:
                        lastrow["url"] = u; break
        if key in ("title","topics"):
            lastrow[key] = (lastrow[key] + " " + t).strip()
        else:
            lastrow[key] = (lastrow[key] + t).strip()
for sec in out["companies"] + out["packs"]:
    for r in sec["rows"]: r.pop("y", None)
json.dump(out, open(sys.argv[2], "w"), indent=0, ensure_ascii=False)
print(len(out["companies"]), "companies", sum(len(c["rows"]) for c in out["companies"]), "rows")
print([ (p["name"], len(p["rows"])) for p in out["packs"]])
