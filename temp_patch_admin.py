from pathlib import Path
p = Path('src/pages/dashboard/AdminDashboard.tsx')
text = p.read_text(encoding='utf-8')
for old, new in [
    ('className="min-w-[650px]"', 'className="min-w-full"'),
    ('className="min-w-[700px]"', 'className="min-w-full"'),
    ('className="min-w-[750px]"', 'className="min-w-full"'),
]:
    text = text.replace(old, new)
p.write_text(text, encoding='utf-8')
print('patched', p)
