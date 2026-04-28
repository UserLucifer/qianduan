import os

filepath = r"app\admins\login\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'localStorage.setItem("adminAccessToken", res.data.adminAccessToken);\n      localStorage.setItem("accessToken", res.data.adminAccessToken);',
    'localStorage.setItem("admin_access_token", res.data.adminAccessToken);'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

filepath = r"api\admin.ts"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { apiGet, apiPost, apiPut } from "./http";',
    'import { adminApiGet, adminApiPost, adminApiPut } from "./http";'
)
content = content.replace("apiGet(", "adminApiGet(")
content = content.replace("apiPost(", "adminApiPost(")
content = content.replace("apiPut(", "adminApiPut(")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

filepath = r"app\login\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'localStorage.setItem("accessToken", res.data.accessToken);',
    'localStorage.setItem("user_access_token", res.data.accessToken);'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

filepath = r"app\signup\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'localStorage.setItem("accessToken", res.data.accessToken);',
    'localStorage.setItem("user_access_token", res.data.accessToken);'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
