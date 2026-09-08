import pymupdf as fitz

doc = fitz.open("docs/gesamtfragenkatalog-lebenindeutschland.pdf")

HEADER_XREF = 1933

for pno in range(len(doc)):
    page = doc[pno]
    infos = page.get_image_info(xrefs=True)
    non_header = [i for i in infos if i['xref'] != HEADER_XREF]
    if non_header:
        xrefs = [i['xref'] for i in non_header]
        print(f"page {pno}: n={len(non_header)} xrefs={xrefs}")
