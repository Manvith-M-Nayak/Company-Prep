"""Build data/questions.json from the parsed PDF JSON.

Usage:
    pip install pymupdf
    python scripts/parse_pdf.py LeetCode_Questions_by_Company_PES.pdf /tmp/parsed.json
    python scripts/build_data.py /tmp/parsed.json data/questions.json
"""
import json
import re
import sys

EXCLUDE = {"PornHub"}  # not appropriate for a university placement portal
DIFF = {"Easy": "E", "Medium": "M", "Hard": "H"}

src = json.load(open(sys.argv[1]))
problems, topics, topic_idx = {}, [], {}


def tid(t):
    if t not in topic_idx:
        topic_idx[t] = len(topics)
        topics.append(t)
    return topic_idx[t]


def add_problem(r):
    lc = int(r["lc"])
    if lc not in problems:
        slug = r["url"].rstrip("/").split("/")[-1]
        tps = [tid(t.strip()) for t in r["topics"].split(",") if t.strip()]
        acc = float(r["acc"].rstrip("%")) if r["acc"] else None
        problems[lc] = [r["title"], DIFF[r["diff"]], acc, tps, 1 if r["premium"] else 0, slug]
    elif problems[lc][2] is None and r["acc"]:
        problems[lc][2] = float(r["acc"].rstrip("%"))
    return lc


companies = []
for c in src["companies"]:
    if c["name"] in EXCLUDE:
        continue
    q = [[add_problem(r), float(r["freq"] or 0), 1 if r["recent"] else 0] for r in c["rows"]]
    m = re.search(r"top \d+ of (\d+) reported", c["meta"])
    companies.append({
        "n": c["name"],
        "c": [s.strip() for s in re.split(r" / (?=[A-Z])", c["category"]) if s.strip()] if c["category"] else [],
        "t": int(m.group(1)) if m else len(q),
        "q": q,
    })

# category strings like "Big Tech / FAANG+" contain " / " themselves; re-join known names
KNOWN = ["Big Tech / FAANG+", "Indian product companies & startups (OA-heavy)", "Service-based / Mass recruiters",
         "Banks, Payments & FinServ", "Infra / Storage / Security / Networking", "Semiconductors & Hardware",
         "Quant / HFT / Trading"]
for c in companies:
    raw = " / ".join(c["c"])
    c["c"] = [k for k in KNOWN if k in raw]

packs = []
for p in src["packs"]:
    packs.append({
        "n": p["name"],
        "d": p["desc"].strip().replace("see [[Aptitude and Reasoning]].", "see the Aptitude section."),
        "q": [[add_problem(r), int(r["companies"] or 0)] for r in p["rows"]],
    })

# acceptance missing for pack-only problems is fine (null)
out = {
    "meta": {"companies": len(companies), "problems": len(problems), "snapshot": "20 Oct 2026",
             "verified": "5 Nov 2026"},
    "topics": topics,
    "categories": KNOWN,
    "problems": problems,
    "companies": companies,
    "packs": packs,
}
json.dump(out, open(sys.argv[2], "w"), separators=(",", ":"), ensure_ascii=False)
print(len(companies), "companies,", len(problems), "problems,", len(topics), "topics")

# Also emit a JS wrapper so the site works when opened straight from disk (file://)
js_path = re.sub(r"\.json$", ".js", sys.argv[2])
with open(js_path, "w") as f:
    f.write("window.PREP_DATA=")
    json.dump(out, f, separators=(",", ":"), ensure_ascii=False)
    f.write(";\n")
