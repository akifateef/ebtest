import json
data = json.load(open('scripts/questions_for_translation.json'))
for d in data:
    if any(o is None for o in d['options']):
        print(d['id'], d['question'], d['options'])
