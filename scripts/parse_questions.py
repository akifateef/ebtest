import json
import re

pages = json.load(open("extracted_images2/all_pages_text.json"))
full = "".join(pages)

# Remove page footer lines like "Seite 9 von 191"
full = re.sub(r"Seite \d+ von \d+", "", full)

BULLET_RE = re.compile(r"[\uf0a3\u25a1]")

# Split by "Aufgabe <n>" headers, but keep track of "Teil II / Fragen für das Bundesland X" markers
# First, split the whole text on state section headers to know section boundaries.
section_pattern = re.compile(r"Teil (I{1,2})\s*\n\s*(Allgemeine Fragen|Fragen für (?:das Bundesland|den Freistaat|die Freie Hansestadt|die Freie und Hansestadt) ([^\n]+))")

# We'll iterate matches of "Aufgabe (\d+)" and slice text between them, then afterwards figure out
# which section each belongs to by scanning for the last section header before it.

aufgabe_pattern = re.compile(r"Aufgabe (\d+)\s*\n")
matches = list(aufgabe_pattern.finditer(full))
print("total Aufgabe matches:", len(matches))

# Find all section headers with their position
header_pattern = re.compile(r"Fragen für (?:das Bundesland|den Freistaat|die Freie Hansestadt Bremen|die Freie und Hansestadt Hamburg)\s+([^\n]+)")
headers = [(m.start(), m.group(1).strip()) for m in header_pattern.finditer(full)]

def section_for(pos):
    sec = "general"
    for hpos, name in headers:
        if hpos < pos:
            sec = name
        else:
            break
    return sec

questions = []
for i, m in enumerate(matches):
    num = int(m.group(1))
    start = m.end()
    end = matches[i+1].start() if i+1 < len(matches) else len(full)
    chunk = full[start:end]
    section = section_for(m.start())
    questions.append({"num": num, "section": section, "raw": chunk})

print("parsed", len(questions))

HEADER_STRIP_RE = re.compile(r"\s*Teil I{1,2}\s+(?:Allgemeine Fragen|Fragen f\u00fcr .*)$")

# Now parse each raw chunk into stem + 4 options using bullet split
parsed = []
fail = []
for q in questions:
    raw = q["raw"]
    parts = BULLET_RE.split(raw)
    stem = parts[0].strip()
    # strip stray leading 'N.' repeat-number line some questions have
    stem = re.sub(r"^\d+\.\s*\n?", "", stem).strip()
    # normalize whitespace: collapse multiple spaces/newlines into single space, but keep line breaks minimal
    stem_clean = re.sub(r"[ \t]+", " ", stem)
    stem_clean = re.sub(r"\s*\n\s*", " ", stem_clean).strip()
    stem_clean = HEADER_STRIP_RE.sub("", stem_clean).strip()
    options = []
    for p in parts[1:]:
        opt = re.sub(r"[ \t]+", " ", p)
        opt = re.sub(r"\s*\n\s*", " ", opt).strip()
        opt = HEADER_STRIP_RE.sub("", opt).strip()
        if opt:
            options.append(opt)
    if len(options) == 1 and q["num"] == 14:
        options = [
            "Passanten auf der Straße beschimpfen darf.",
            "meine Meinung im Internet äußern kann.",
            "Nazi-, Hamas- oder Islamischer Staat-Symbole öffentlich tragen darf.",
            "meine Meinung nur dann äußern darf, solange ich der Regierung nicht widerspreche.",
        ]
    if len(options) != 4:
        fail.append((q["num"], q["section"], len(options), stem_clean[:60]))
    parsed.append({
        "num": q["num"],
        "section": q["section"],
        "question": stem_clean,
        "options": options[:4],
    })

print("failures (not exactly 4 options):", len(fail))
for f in fail[:60]:
    print(f)

with open("extracted_images2/parsed_questions.json", "w") as f:
    json.dump(parsed, f, ensure_ascii=False, indent=1)
