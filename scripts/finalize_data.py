import json
import re
import shutil
import os

merged = json.load(open("extracted_images2/merged_with_pages.json"))
page_map = json.load(open("extracted_images2/page_map.json"))
page_data = json.load(open("extracted_images2/page_data.json"))

page_images = {}
for pd in page_data:
    imgs = sorted(pd["images"], key=lambda i: i["bbox"][0])
    page_images[pd["page"]] = [i["xref"] for i in imgs]

lookup = {(r["num"], r["section"]): r["page"] for r in page_map}

IMG_SRC_DIR = "extracted_images2"
IMG_DEST_DIR = "frontend/public/images"
os.makedirs(IMG_DEST_DIR, exist_ok=True)
for f in os.listdir(IMG_DEST_DIR):
    os.remove(f"{IMG_DEST_DIR}/{f}")

STATE_IDS = {
    "Baden-Württemberg": "baden-wuerttemberg",
    "Bayern": "bayern",
    "Berlin": "berlin",
    "Brandenburg": "brandenburg",
    "Bremen": "bremen",
    "Hamburg": "hamburg",
    "Hessen": "hessen",
    "Mecklenburg-Vorpommern": "mecklenburg-vorpommern",
    "Niedersachsen": "niedersachsen",
    "Nordrhein-Westfalen": "nordrhein-westfalen",
    "Rheinland-Pfalz": "rheinland-pfalz",
    "Saarland": "saarland",
    "Sachsen": "sachsen",
    "Sachsen-Anhalt": "sachsen-anhalt",
    "Schleswig-Holstein": "schleswig-holstein",
    "Thüringen": "thueringen",
}

is_general = lambda sec: sec == "general"

# Extra decorative-only context images not flagged in the reference answer dataset
# (the correct answer for these does not depend on the image, but we include the
# original illustration for fidelity with the source PDF).
EXTRA_CONTEXT = {70: None, 181: None, 216: None, 235: None}
for num in EXTRA_CONTEXT:
    page = lookup[(num, "general")]
    xrefs = page_images.get(page, [])
    EXTRA_CONTEXT[num] = xrefs[0] if xrefs else None

CREDIT_RE = re.compile(r"\s*©[^\n]*$")
BILD_TAIL_RE = re.compile(r"\s*Bild 1\s*Bild 2\s*Bild 3\s*Bild 4\s*$")
ANLEHNUNG_RE = re.compile(r"\s*In Anlehnung an[^\n]*$")


def clean_question(text, caption_hint=None):
    text = BILD_TAIL_RE.sub("", text)
    m = CREDIT_RE.search(text)
    credit = None
    if m:
        credit = m.group(0).strip()
        text = CREDIT_RE.sub("", text)
    m2 = ANLEHNUNG_RE.search(text)
    anlehnung = None
    if m2:
        anlehnung = m2.group(0).strip()
        text = ANLEHNUNG_RE.sub("", text)
    return text.strip(), credit, anlehnung


final = []
img_copy_count = 0
for m in merged:
    section = m["section"]
    state_id = None if is_general(section) else STATE_IDS[section]
    qid = f"general-{m['num']}" if is_general(section) else f"{state_id}-{m['num']}"

    options_raw = m["options"]
    options = []
    context_image = None
    context_caption = None

    question_text, credit, anlehnung = clean_question(m["question"])
    if anlehnung:
        context_caption = anlehnung

    if m.get("img"):
        xrefs = m["_xrefs"]
        img_kind = "per_option" if set(options_raw) == {"Bild 1", "Bild 2", "Bild 3", "Bild 4"} else "single"
        if img_kind == "per_option" and len(xrefs) == 4:
            for idx, xref in enumerate(xrefs):
                src = f"{IMG_SRC_DIR}/img_{xref}.png"
                fname = f"{qid}-opt{idx+1}.png"
                dest = f"{IMG_DEST_DIR}/{fname}"
                shutil.copyfile(src, dest)
                img_copy_count += 1
                options.append({"text": None, "image": f"images/{fname}"})
        else:
            xref = xrefs[0]
            src = f"{IMG_SRC_DIR}/img_{xref}.png"
            fname = f"{qid}-context.png"
            dest = f"{IMG_DEST_DIR}/{fname}"
            shutil.copyfile(src, dest)
            img_copy_count += 1
            context_image = f"images/{fname}"
            if m["img"].get("text"):
                context_caption = m["img"]["text"]
            for o in options_raw:
                options.append({"text": o, "image": None})
    elif is_general(section) and m["num"] in EXTRA_CONTEXT and EXTRA_CONTEXT[m["num"]] is not None:
        xref = EXTRA_CONTEXT[m["num"]]
        src = f"{IMG_SRC_DIR}/img_{xref}.png"
        fname = f"{qid}-context.png"
        dest = f"{IMG_DEST_DIR}/{fname}"
        shutil.copyfile(src, dest)
        img_copy_count += 1
        context_image = f"images/{fname}"
        for o in options_raw:
            options.append({"text": o, "image": None})
    else:
        for o in options_raw:
            options.append({"text": o, "image": None})

    final.append({
        "id": qid,
        "number": m["num"],
        "section": "general" if is_general(section) else "state",
        "stateId": state_id,
        "stateName": None if is_general(section) else section,
        "category": m.get("category"),
        "question": question_text,
        "imageCredit": credit,
        "options": options,
        "correctIndex": m["correct"],
        "contextImage": context_image,
        "contextCaption": context_caption,
    })

print("total questions:", len(final))
print("images copied:", img_copy_count)

general_count = sum(1 for f in final if f["section"] == "general")
state_count = sum(1 for f in final if f["section"] == "state")
print("general:", general_count, "state:", state_count)

with open("frontend/src_questions.json", "w") as f:
    json.dump(final, f, ensure_ascii=False, indent=1)
