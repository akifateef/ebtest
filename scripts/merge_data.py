import json
import re
import difflib

parsed = json.load(open("extracted_images2/parsed_questions.json"))
ref = json.load(open("/tmp/eb1/packages/mobile-app/assets/data.json"))

assert len(parsed) == len(ref) == 460

def norm(s):
    s = s.lower()
    s = re.sub(r"[\"'„“()\.,;:!?…]", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

low_sim = []
merged = []
for i, (p, r) in enumerate(zip(parsed, ref)):
    sim = difflib.SequenceMatcher(None, norm(p["question"]), norm(r["question"])).ratio()
    if sim < 0.6:
        low_sim.append((i, sim, p["question"][:60], r["question"][:60]))
    merged.append({
        "index": i,
        "num": p["num"],
        "section": p["section"],
        "question": p["question"],
        "options": p["options"],
        "correct": r["correct"],
        "category": r.get("category"),
        "img": r.get("img"),
        "sim": round(sim, 3),
    })

print("low similarity count:", len(low_sim))
for l in low_sim:
    print(l)

with open("extracted_images2/merged_questions.json", "w") as f:
    json.dump(merged, f, ensure_ascii=False, indent=1)
