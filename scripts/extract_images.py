import pymupdf as fitz
import os
import json

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")
HEADER_XREF = 1933

out_dir = "extracted_images"
os.makedirs(out_dir, exist_ok=True)

seen_xrefs = set()
page_data = []  # list of {page, images: [{xref, x0}]}

for pno in range(len(doc)):
    page = doc[pno]
    infos = page.get_image_info(xrefs=True)
    non_header = [i for i in infos if i['xref'] != HEADER_XREF]
    if not non_header:
        continue
    # sort left to right
    non_header.sort(key=lambda i: i['bbox'][0])
    imgs = []
    for i in non_header:
        xref = i['xref']
        imgs.append({"xref": xref, "x0": i['bbox'][0]})
        if xref not in seen_xrefs:
            seen_xrefs.add(xref)
            base = doc.extract_image(xref)
            ext = base["ext"]
            fname = f"{out_dir}/img_{xref}.{ext}"
            with open(fname, "wb") as f:
                f.write(base["image"])
    page_data.append({"page": pno, "images": imgs})

with open("extracted_images/page_data.json", "w") as f:
    json.dump(page_data, f, indent=2)

print("unique images:", len(seen_xrefs))
print("pages with images:", len(page_data))
