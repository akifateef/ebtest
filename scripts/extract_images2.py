import pymupdf as fitz
import os
import json

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")
HEADER_XREF = 1933

out_dir = "extracted_images2"
os.makedirs(out_dir, exist_ok=True)

seen_xrefs = {}  # xref -> (page, bbox)
page_data = []

for pno in range(len(doc)):
    page = doc[pno]
    infos = page.get_image_info(xrefs=True)
    non_header = [i for i in infos if i['xref'] != HEADER_XREF]
    if not non_header:
        continue
    non_header.sort(key=lambda i: i['bbox'][0])
    imgs = []
    for i in non_header:
        xref = i['xref']
        imgs.append({"xref": xref, "bbox": i['bbox']})
        if xref not in seen_xrefs:
            seen_xrefs[xref] = (pno, i['bbox'])
    page_data.append({"page": pno, "images": imgs})

zoom = 4
mat = fitz.Matrix(zoom, zoom)
for xref, (pno, bbox) in seen_xrefs.items():
    page = doc[pno]
    rect = fitz.Rect(bbox)
    pix = page.get_pixmap(matrix=mat, clip=rect, alpha=False)
    pix.save(f"{out_dir}/img_{xref}.png")

with open(f"{out_dir}/page_data.json", "w") as f:
    json.dump(page_data, f, indent=2, default=str)

print("done", len(seen_xrefs))
