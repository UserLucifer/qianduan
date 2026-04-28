import re

filepath = r"app\admins\orders\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replacements for orderNo -> id where it refers to data
content = re.sub(r'row\.orderNo', r'row.id', content)
content = re.sub(r'detail\.orderNo', r'detail.id', content)
content = re.sub(r'data\.orderNo', r'data.id', content)
content = re.sub(r'openDetail\(row\.orderNo\)', r'openDetail(row.id)', content)
# But wait! Do I also change the `orderNo` state variables?
# The search filter is `orderNo`, the API query expects `order_no`, so `orderNo` parameter is correct for filtering.
# We only want to change the DTO fields. So `row.orderNo` and `detail.orderNo` and `data.orderNo` are the main ones.

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
