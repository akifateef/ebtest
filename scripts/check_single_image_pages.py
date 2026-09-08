import pymupdf as fitz

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")
for pno in [20, 26, 47, 63, 66, 69, 80, 87, 114, 119]:
    page = doc[pno]
    print("=== PAGE", pno, "===")
    print(page.get_text())
