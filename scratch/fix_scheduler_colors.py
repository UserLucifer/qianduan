import re

filepath = r"app\admins\scheduler\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace classes
replacements = [
    (r'border-white/10 bg-white/\[0\.025\]', r'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.025]'),
    (r'text-rose-200', r'text-rose-600 dark:text-rose-200'),
    (r'border-white/10 bg-white/\[0\.03\] text-zinc-300 hover:bg-white/\[0\.06\] hover:text-white', r'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white'),
    (r'text-zinc-50(?=\s|")', r'text-foreground dark:text-zinc-50'),
    (r'text-zinc-300(?=\s|")', r'text-slate-600 dark:text-zinc-300'),
    (r'text-emerald-400(?=\s|")', r'text-emerald-600 dark:text-emerald-400'),
    (r'text-rose-400(?=\s|")', r'text-rose-600 dark:text-rose-400'),
    (r'text-rose-300(?=\s|")', r'text-rose-600 dark:text-rose-300'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

