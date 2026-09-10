import json
import sys

src = json.load(open("scripts/questions_for_translation.json"))
src_ids = set(q["id"] for q in src)

langs = sys.argv[1:] or ["ru", "uk", "pl", "fr", "it", "zh", "ja", "ur", "es", "tr"]

for lang in langs:
    path = f"frontend/src/data/translations/{lang}.json"
    try:
        out = json.load(open(path))
    except FileNotFoundError:
        print(lang, "FILE MISSING")
        continue
    except Exception as e:
        print(lang, "JSON ERROR", e)
        continue
    ok = True
    if len(out) != 460:
        print(lang, "count mismatch", len(out))
        ok = False
    if set(out.keys()) != src_ids:
        missing = src_ids - set(out.keys())
        extra = set(out.keys()) - src_ids
        print(lang, "id mismatch missing=", list(missing)[:5], "extra=", list(extra)[:5])
        ok = False
    for q in src:
        entry = out.get(q["id"])
        if not entry:
            continue
        if not entry.get("question"):
            print(lang, "missing question", q["id"])
            ok = False
            break
        opts = entry.get("options", [])
        if len(opts) != 4:
            print(lang, "bad options len", q["id"], opts)
            ok = False
            break
        bad = False
        for i, o in enumerate(q["options"]):
            if o is None:
                if opts[i] is not None:
                    print(lang, "expected null", q["id"], i)
                    ok = False
                    bad = True
                    break
            else:
                if not opts[i]:
                    print(lang, "missing translated option", q["id"], i)
                    ok = False
                    bad = True
                    break
        if bad:
            break
    if ok:
        print(lang, "OK 460 entries valid")
