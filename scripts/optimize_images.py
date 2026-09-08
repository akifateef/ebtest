import os
from PIL import Image

DIR = "frontend/public/images"

PHOTO_SUFFIXES = ("-context.png",)
# photos (real photographs) get JPEG; crest/map line-art keep PNG but resized+optimized
PHOTO_IDS = {"general-55", "general-70", "general-181", "general-216", "general-235"}

total_before = 0
total_after = 0

for fname in os.listdir(DIR):
    path = f"{DIR}/{fname}"
    size_before = os.path.getsize(path)
    total_before += size_before
    im = Image.open(path)

    is_photo = any(fname.startswith(pid) for pid in PHOTO_IDS)
    is_opt_crest = "-opt" in fname
    is_map_context = fname.endswith("-context.png") and not is_photo

    if is_opt_crest:
        max_dim = 360
    elif is_map_context:
        max_dim = 900
    else:
        max_dim = 900

    w, h = im.size
    scale = min(1.0, max_dim / max(w, h))
    if scale < 1.0:
        im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    if is_photo:
        out_path = path.replace(".png", ".jpg")
        im.convert("RGB").save(out_path, "JPEG", quality=80, optimize=True)
        os.remove(path)
        path = out_path
    else:
        im.save(path, "PNG", optimize=True)

    size_after = os.path.getsize(path)
    total_after += size_after

print(f"before: {total_before/1024/1024:.2f} MB, after: {total_after/1024/1024:.2f} MB")
