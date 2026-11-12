# Placement Prep

Company-wise interview preparation site for campus placements. Type a company name and get:

- **Organization details**: website, careers, LinkedIn, Facebook, X, Instagram, and the roles offered (you can edit the role to match the placement notice)
- **Interview references**: GeeksForGeeks, AmbitionBox, LeetCode Discuss, Glassdoor, YouTube, Reddit
- **Interview highlights**: core prep links, plus topics and problems chosen from that company's own question data
- **Every reported LeetCode question** for the company, with filters, sorting and solved-ticks
- **Download PDF** of the full prep sheet and questions, and **Copy prep message** in the WhatsApp format

It also has:

- Cross-company prep packs: Top 150, Trending, Indian startups, Quant/HFT, Service-based
- Study planner: an N-day plan with recent questions first, then by frequency
- Compare: the problems two companies share
- Progress tracking with export/import
- Resources: OA formats, proxy lists for companies with no data, core CS subjects, aptitude, HR questions and a resume checklist

About 940 companies are searchable: 692 with question lists and about 240 more campus recruiters. Companies with no question data (for example Aveva) still get a full prep sheet. Their questions come from the closest category pack.

## Deploy on Vercel

1. Go to vercel.com → **Add New… → Project** → import `Company-Prep` from GitHub.
2. Framework preset: **Other**. Leave the build command empty. The output directory is the repo root (`vercel.json` already sets this).
3. Click **Deploy**. Every push to `main` redeploys automatically.

Or from the terminal: `npx vercel --prod`.

## Run locally

There is no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Data

The questions come from `LeetCode_Questions_by_Company.pdf` (notes by Dr. Animesh Giri). The PDF isn't committed, so put it in the repo root first. To regenerate `data/questions.js` after the PDF is updated:

```bash
pip install pymupdf
python scripts/parse_pdf.py LeetCode_Questions_by_Company.pdf /tmp/parsed.json
python scripts/build_data.py /tmp/parsed.json data/questions.json
python scripts/enrich_wikidata.py data/questions.json data/links.json   # official links from Wikidata
```

Companies that recruit on campus but have no LeetCode data are listed in `scripts/extra_companies.py`. To add more, put the name under the right category and rerun the two build commands.

To add or correct a company's official links and roles, edit `assets/company-info.js`.
