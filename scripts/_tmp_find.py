import json
data = json.load(open('scripts/questions_for_translation.json'))
idx = {d['id']: i for i, d in enumerate(data)}
print(idx['general-103'], idx['general-300'], len(data))
print(idx['baden-wuerttemberg-1'], idx['thueringen-10'])
