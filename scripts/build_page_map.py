import pymupdf as fitz
import json
import re

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")

current_section = "general"
records = []  # (page_no, aufgabe_num, section)
header_re = re.compile(r"Fragen f\u00fcr (?:das Bundesland|den Freistaat|die Freie Hansestadt Bremen|die Freie und Hansestadt Hamburg)\s+([^\n]+)")
aufgabe_re = re.compile(r"Aufgabe (\d+)")

for pno in range(len(doc)):
    text = doc[pno].get_text()
    hm = header_re.search(text)
    if hm:
        current_section = hm.group(1).strip()
    for m in aufgabe_re.finditer(text):
        records.append({"page": pno, "num": int(m.group(1)), "section": current_section})

with open("extracted_images2/page_map.json", "w") as f:
    json.dump(records, f, indent=1, ensure_ascii=False)
print("records:", len(records))
