import os

filepath = r"app\login\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'localStorage.getItem("accessToken");',
    'localStorage.getItem("user_access_token");'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

filepath = r"app\dashboard\settings\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'localStorage.getItem("accessToken")',
    'localStorage.getItem("user_access_token")'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
