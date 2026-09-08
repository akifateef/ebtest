import pymupdf as fitz

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")
for pno in [109, 110, 111, 113, 114]:
    page = doc[pno]
    print("=== PAGE", pno, "===")
    print(page.get_text())
    print("IMAGES:", [(i['xref'], i['bbox']) for i in page.get_image_info(xrefs=True) if i['xref']!=1933])
