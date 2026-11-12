"""Look up official website + social handles for every company on Wikidata.

Usage: python scripts/enrich_wikidata.py data/questions.json data/links.json
Writes {name: {site, linkedin, x, instagram, facebook, wd}} plus a .js wrapper.

Names are matched exactly against English labels/aliases in batched SPARQL
queries. Among matches, only organisation-like entities are accepted and the
best-known one (most Wikipedia sitelinks) wins. Anything ambiguous is left out
so the site falls back to a search link rather than showing a wrong URL.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

ENDPOINT = "https://query.wikidata.org/sparql"
UA = {"User-Agent": "PESUPlacementPrep/1.0 (student project; static site data build)",
      "Accept": "application/sparql-results+json"}
ORG = re.compile(r"compan|corporat|firm\b|bank|business|manufactur|developer|provider|conglomerate|enterprise|start-?up|"
                 r"platform|retailer|consult|services|subsidiary|insur|fund|organi[sz]ation|brand|website|marketplace|"
                 r"unicorn|technolog|software|semiconductor|e-commerce|fintech|group|multinational|trading|hedge|"
                 r"investment|airline|automaker|aerospace|maker|operator|agency|exchange|publisher|studio|lender|"
                 r"payment|bureau|analytics|engineering|holding|conglomerate|chain|network", re.I)
NOT_ORG = re.compile(r"\b(film|album|song|single|footballer|village|river|novel|species|episode|band|politician|"
                     r"human|actor|actress|given name|family name|surname|asteroid|genus|disambiguation|"
                     r"television series|documentary|periodical|magazine|board game|video game\b(?! (company|developer|publisher))|"
                     r"scholarly article|programming language|protein|gene|wikimedia|stadium|building|award|"
                     r"software\b(?! (company|developer|firm|maker|vendor))|mobile app|web browser|operating system)\b", re.I)
# Manually reviewed wrong matches (a different organisation with the same name).
BLOCK = {"ADP", "ANZ", "Amplitude", "Aurora", "Axon", "Blend", "Continental", "DRW", "EY", "IMC", "KLA", "LTI", "OYO",
         "Quip", "SAP", "Setu", "Slice", "Polar", "SIG", "Motive", "Zoom", "Zeta", "Fynd"}
# Right organisation but the listed website is wrong / regional / a redirect.
DROP_SITE = {"Twilio", "TuSimple", "GE Healthcare", "Plaid"}
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

QUERY = """
SELECT ?name ?item ?desc ?links
  (SAMPLE(?site) AS ?site) (SAMPLE(?li) AS ?li)
  (GROUP_CONCAT(DISTINCT ?x; separator="|") AS ?xs)
  (GROUP_CONCAT(DISTINCT ?ig; separator="|") AS ?igs)
  (GROUP_CONCAT(DISTINCT ?fb; separator="|") AS ?fbs)
WHERE {
  VALUES ?name { %s }
  { ?item rdfs:label ?name } UNION { ?item skos:altLabel ?name }
  ?item wdt:P856|wdt:P4264 [] .
  ?item wikibase:sitelinks ?links .
  OPTIONAL { ?item schema:description ?desc FILTER(lang(?desc) = "en") }
  OPTIONAL { ?item wdt:P856 ?site } OPTIONAL { ?item wdt:P4264 ?li } OPTIONAL { ?item wdt:P2002 ?x }
  OPTIONAL { ?item wdt:P2003 ?ig } OPTIONAL { ?item wdt:P2013 ?fb }
}
GROUP BY ?name ?item ?desc ?links
"""


def sparql(names):
    values = " ".join('"%s"@en' % n.replace("\\", "").replace('"', '') for n in names)
    body = urllib.parse.urlencode({"query": QUERY % values}).encode()
    for attempt in range(5):
        try:
            req = urllib.request.Request(ENDPOINT, data=body, headers=UA)
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.load(r)["results"]["bindings"]
        except Exception as e:  # rate limit / timeout: back off and retry
            print("retry", attempt, e, file=sys.stderr)
            time.sleep(5 * (attempt + 1))
    return []


def pick_handle(values, name):
    """Several accounts are often listed (support, regional...). Prefer the one closest to the company name."""
    vals = [v for v in values.split("|") if v]
    if not vals:
        return None
    n = norm(name)
    bad = re.compile(r"help|support|care|news|policy|jobs|careers|dev|eng|_[a-z]{2}$|in$|uk$|india$", re.I)
    return sorted(vals, key=lambda v: (norm(v) != n, not norm(v).startswith(n[:5]), bool(bad.search(v)), len(v)))[0]


def main():
    data = json.load(open(sys.argv[1]))
    names = [c["n"] for c in data["companies"]] + [x[0] for x in data.get("extras", [])]
    query_name = {n: re.sub(r"\s*\(.*?\)", "", n).strip() for n in names}  # "X (Twitter)" -> "X"
    by_q = {}
    for n, q in query_name.items():
        by_q.setdefault(q, []).append(n)
    qs = list(by_q)
    best = {}
    for i in range(0, len(qs), 60):
        rows = sparql(qs[i:i + 60])
        for b in rows:
            q = b["name"]["value"]
            desc = b.get("desc", {}).get("value", "")
            if not desc or NOT_ORG.search(desc) or not ORG.search(desc):
                continue
            score = (int(b["links"]["value"]) + (5 if "li" in b else 0))
            if q not in best or score > best[q][0]:
                best[q] = (score, b)
        print(f"{min(i + 60, len(qs))}/{len(qs)} queried, {len(best)} matched", file=sys.stderr)
        time.sleep(1)

    links = {}
    for q, (_, b) in best.items():
        if q in BLOCK:
            continue
        get = lambda k: b.get(k, {}).get("value", "") if not (k == "site" and q in DROP_SITE) else ""
        out = {"wd": get("item").rsplit("/", 1)[-1], "desc": get("desc")}
        if get("site"): out["site"] = get("site")
        if get("li"): out["linkedin"] = f"https://www.linkedin.com/company/{get('li')}"
        if (h := pick_handle(get("xs"), q)): out["x"] = f"https://x.com/{h}"
        if (h := pick_handle(get("igs"), q)): out["instagram"] = f"https://www.instagram.com/{h}/"
        if (h := pick_handle(get("fbs"), q)): out["facebook"] = f"https://www.facebook.com/{h}"
        for n in by_q[q]:
            links[n] = out
    json.dump(links, open(sys.argv[2], "w"), indent=0, ensure_ascii=False, sort_keys=True)
    with open(re.sub(r"\.json$", ".js", sys.argv[2]), "w") as f:
        f.write("window.COMPANY_LINKS=" + json.dumps(links, separators=(",", ":"), ensure_ascii=False, sort_keys=True) + ";\n")
    print(f"{len(links)}/{len(names)} companies matched")


if __name__ == "__main__":
    main()
