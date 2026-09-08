import json

merged = json.load(open("extracted_images2/merged_questions.json"))
page_map = json.load(open("extracted_images2/page_map.json"))
page_data = json.load(open("extracted_images2/page_data.json"))  # from extract_images2.py

# page_data: list of {"page": pno, "images": [{"xref":..., "bbox": [...]}]}
page_images = {}
for pd in page_data:
    imgs = sorted(pd["images"], key=lambda i: i["bbox"][0])
    page_images[pd["page"]] = [i["xref"] for i in imgs]

# build lookup (num, section) -> page
lookup = {}
for r in page_map:
    lookup[(r["num"], r["section"])] = r["page"]

missing = []
for m in merged:
    if not m.get("img"):
        continue
    key = (m["num"], m["section"])
    page = lookup.get(key)
    if page is None:
        missing.append(key)
        continue
    xrefs = page_images.get(page, [])
    m["_page"] = page
    m["_xrefs"] = xrefs

print("missing pages for img questions:", missing)

for m in merged:
    if m.get("img"):
        print(m["num"], m["section"][:12], m.get("_page"), m.get("_xrefs"), m["options"])

with open("extracted_images2/merged_with_pages.json", "w") as f:
    json.dump(merged, f, ensure_ascii=False, indent=1)
