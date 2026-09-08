import pymupdf as fitz
import json

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")
HEADER_XREF = 1933

current_state = None
for pno in range(108, 191):
    page = doc[pno]
    text = page.get_text()
    if "Fragen für das Bundesland" in text or "Fragen für den Freistaat" in text or "Freie Hansestadt" in text or "Freien und Hansestadt" in text:
        for line in text.split("\n"):
            if "Fragen für" in line:
                current_state = line.strip()
    infos = [i for i in page.get_image_info(xrefs=True) if i['xref'] != HEADER_XREF]
    if infos:
        # find which Aufgabe this belongs to - print full text plus images
        print(f"PAGE {pno} STATE={current_state}")
        print(text[:200].replace("\n"," | "))
        print("IMAGES:", [(i['xref']) for i in sorted(infos, key=lambda x: x['bbox'][0])])
        print()
