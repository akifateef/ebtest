import json
data = json.load(open('scripts/questions_for_translation.json'))
idx = {d['id']: i for i, d in enumerate(data)}
start = idx['general-103']
end = idx['general-300']
with open('scripts/_tmp_general.txt', 'w') as f:
    for d in data[start:end+1]:
        f.write(f"### {d['id']}\n")
        f.write(f"Q: {d['question']}\n")
        for i, o in enumerate(d['options']):
            f.write(f"  {i}: {o}\n")
        f.write("\n")

start = idx['baden-wuerttemberg-1']
with open('scripts/_tmp_states.txt', 'w') as f:
    for d in data[start:]:
        f.write(f"### {d['id']}\n")
        f.write(f"Q: {d['question']}\n")
        for i, o in enumerate(d['options']):
            f.write(f"  {i}: {o}\n")
        f.write("\n")
print("done")
