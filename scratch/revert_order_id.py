import re

filepath = r"app\admins\orders\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Revert row.id -> row.orderNo
content = re.sub(r'row\.id', r'row.orderNo', content)
# Revert detail.id -> detail.orderNo
content = re.sub(r'detail\.id', r'detail.orderNo', content)
# Revert data.id -> data.orderNo
content = re.sub(r'data\.id', r'data.orderNo', content)
# Revert openDetail(row.id) -> openDetail(row.orderNo)
content = re.sub(r'openDetail\(row\.id\)', r'openDetail(row.orderNo)', content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
