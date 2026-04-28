import os
import re

filepath = r"api\admin.ts"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace function calls correctly with regex boundaries
content = re.sub(r'\bapiGet\b', 'adminApiGet', content)
content = re.sub(r'\bapiPost\b', 'adminApiPost', content)
content = re.sub(r'\bapiPut\b', 'adminApiPut', content)

# But the import statement needs to be:
# import { adminApiGet, adminApiPost, adminApiPut } from "./http";
# If it's already there, `re.sub` would have changed it to `import { adminadminApiGet...` if it was already `adminApiGet`? No, because it was still `apiGet`.
# Let's just fix the import:
content = re.sub(r'import\s+{\s*adminApiGet,\s*adminApiPost,\s*adminApiPut\s*}\s*from\s*"./http";', 'import { adminApiGet, adminApiPost, adminApiPut } from "./http";', content)
content = re.sub(r'import\s+{\s*apiGet,\s*apiPost,\s*apiPut\s*}\s*from\s*"./http";', 'import { adminApiGet, adminApiPost, adminApiPut } from "./http";', content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
