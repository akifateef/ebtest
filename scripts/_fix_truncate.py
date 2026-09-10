import sys
marker = sys.argv[1].encode()
with open('frontend/src/data/translations/zh.json', 'rb') as f:
    data = f.read()
idx = data.find(marker)
print('idx', idx)
truncated = data[:idx].rstrip()
if truncated.endswith(b','):
    truncated = truncated[:-1]
truncated += b'\n}\n'
with open('frontend/src/data/translations/zh.json', 'wb') as f:
    f.write(truncated)
print('done, len=', len(truncated))
