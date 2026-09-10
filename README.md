# ebtest — Einbürgerungstest Trainer

A frontend-only React app for practicing the German citizenship test
("Leben in Deutschland" / Einbürgerungstest). Built to be deployed as a
static site on GitHub Pages.

🔗 **Live app:** https://akif.me/ebtest/

## Features

- All **460 official questions** (300 general + 16 × 10 state-specific)
  extracted directly from the official BAMF question catalog
  (`docs/gesamtfragenkatalog-lebenindeutschland.pdf`, Stand 07.05.2025).
- Image-based questions (coats of arms, flags, maps, ballot papers) are
  rendered with the real images cropped from the source PDF.
- Choose **general** questions or a specific **Bundesland**.
- Choose **sequential** or **random** question order.
- One question at a time, with **Next/Back** navigation that is never
  blocked by whether you've answered yet.
- Selecting an answer turns it **green** (correct) or **red** (wrong), and
  always reveals the correct answer.
- Progress (every answer you've given) is stored in `localStorage`, with a
  **Reset progress** action available at any time.

## Direct links to the exam simulation

You can jump straight into the exam simulation for a specific Bundesland by
opening `https://akif.me/ebtest/?exam=<stateId>`, skipping the setup screen
entirely:

| Bundesland | Link |
| --- | --- |
| Baden-Württemberg | https://akif.me/ebtest/?exam=baden-wuerttemberg |
| Bayern | https://akif.me/ebtest/?exam=bayern |
| Berlin | https://akif.me/ebtest/?exam=berlin |
| Brandenburg | https://akif.me/ebtest/?exam=brandenburg |
| Bremen | https://akif.me/ebtest/?exam=bremen |
| Hamburg | https://akif.me/ebtest/?exam=hamburg |
| Hessen | https://akif.me/ebtest/?exam=hessen |
| Mecklenburg-Vorpommern | https://akif.me/ebtest/?exam=mecklenburg-vorpommern |
| Niedersachsen | https://akif.me/ebtest/?exam=niedersachsen |
| Nordrhein-Westfalen | https://akif.me/ebtest/?exam=nordrhein-westfalen |
| Rheinland-Pfalz | https://akif.me/ebtest/?exam=rheinland-pfalz |
| Saarland | https://akif.me/ebtest/?exam=saarland |
| Sachsen | https://akif.me/ebtest/?exam=sachsen |
| Sachsen-Anhalt | https://akif.me/ebtest/?exam=sachsen-anhalt |
| Schleswig-Holstein | https://akif.me/ebtest/?exam=schleswig-holstein |
| Thüringen | https://akif.me/ebtest/?exam=thueringen |

Each link starts a brand-new 33-question exam (30 general + 3 from that
state) with a fresh 60-minute timer, overriding any exam already in
progress. An in-app shortcut link next to the "Prüfungssimulation" option
on the setup screen does the same thing for whichever Bundesland is
currently selected in the dropdown.

## Project structure

```
docs/                      Official BAMF PDF question catalog (source of truth)
scripts/                   One-off Python pipeline used to extract & verify the data
frontend/                  The React (Vite + TypeScript) app
  src/data/questions.json  Final structured question dataset used by the app
  public/images/           Cropped images for image-based questions
.github/workflows/deploy.yml  GitHub Pages deployment workflow
```

## How the question data was built

1. `scripts/dump_text.py` / `scripts/parse_questions.py` — extract and parse
   all 460 questions and answer options directly from the official PDF
   using PyMuPDF, preserving the exact wording from the source document.
2. `scripts/extract_images2.py` — locate and render every embedded image
   (coats of arms, flags, maps, ballot paper samples) straight from the PDF
   at high resolution.
3. Correct answers (including for the image-based questions) were
   cross-checked against two independent open-source projects that already
   maintain verified answer keys for the same official (07.05.2025) question
   catalog, to make sure nothing was mis-transcribed:
   - https://github.com/flexsurfer/einburgerungstest
   - https://github.com/abdullahbutt/leben-in-deutschland-test
4. `scripts/merge_data.py`, `scripts/build_page_map.py`, `scripts/assemble.py`,
   `scripts/finalize_data.py` — merge the extracted question text with the
   verified correct-answer indices, attach the right cropped image(s) to
   each question, and write the final `frontend/src/data/questions.json`.
5. `scripts/optimize_images.py` — downscale/compress the exported images for
   the web (PNG for line-art crests/maps, JPEG for photographs).

These scripts were run once to produce the checked-in data/images; they are
kept for transparency and reproducibility but aren't needed to run the app.

## Development

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
```

Output goes to `frontend/dist/`.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds the app and deploys
`frontend/dist` to GitHub Pages automatically on every push to `main`.

To enable it:

1. Push this repository to GitHub.
2. In the repo settings, go to **Pages** and set the source to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — the site will be
   published at `https://<your-username>.github.io/<repo-name>/`
   (for this repo: https://akif.me/ebtest/, via a custom domain).

The Vite config uses a relative `base: './'`, so the build works regardless
of the repository name / subpath it's served from — renaming the repo (as
was done here, from `Einbuergerungstest` to `ebtest`) needs no code changes,
just a re-run of the deploy workflow.

## Acknowledgements

Thanks to these open-source projects, whose independently maintained answer
keys were used to cross-check the correctness of the questions extracted
from the official PDF in this app:

- [flexsurfer/einburgerungstest](https://github.com/flexsurfer/einburgerungstest)
- [abdullahbutt/leben-in-deutschland-test](https://github.com/abdullahbutt/leben-in-deutschland-test)

## Disclaimer

This is an unofficial study aid. Always verify current officeholders and
any time-sensitive facts against the official BAMF materials before your
actual test.
