import sys

path = 'frontend/src/data/translations/ur.json'
keep_lines = int(sys.argv[1])

with open(path, encoding='utf-8') as f:
    lines = f.readlines()

lines = lines[:keep_lines]
# ensure last kept line ends properly, then close the object
with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
    f.write('}\n')
