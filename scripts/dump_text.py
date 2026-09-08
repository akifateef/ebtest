import pymupdf as fitz
import json

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")
pages = []
for pno in range(len(doc)):
    pages.append(doc[pno].get_text())

with open("extracted_images2/all_pages_text.json", "w") as f:
    json.dump(pages, f, ensure_ascii=False, indent=1)
print("pages:", len(pages))
