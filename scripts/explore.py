import pymupdf as fitz

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")

for pno in [8, 77]:
    page = doc[pno]
    print("PAGE", pno)
    for info in page.get_image_info(xrefs=True):
        print(info)
