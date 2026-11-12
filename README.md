# PESU Placement Prep

Company-wise interview preparation site for PES University students. Type a company name and get:

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

Companies with no question data (for example Aveva) still get a full prep sheet. Their questions come from the closest category pack.

## Run

There is no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Data

The questions come from `LeetCode_Questions_by_Company_PES.pdf` (notes by Dr. Animesh Giri, PESU EC Campus). To regenerate `data/questions.js` after the PDF is updated:

```bash
pip install pymupdf
python scripts/parse_pdf.py LeetCode_Questions_by_Company_PES.pdf /tmp/parsed.json
python scripts/build_data.py /tmp/parsed.json data/questions.json
```

To add or correct a company's official links and roles, edit `assets/company-info.js`.

This is an unofficial tool built by a student. It is not affiliated with PES University.
