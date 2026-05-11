
import json
import os

path = r'e:\业务开发\qianduan\messages\zh-CN.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'WithdrawAddresses' in data:
    if 'form' in data['WithdrawAddresses']:
        data['WithdrawAddresses']['form']['basicSection'] = '基础配置'
        data['WithdrawAddresses']['form']['settingsSection'] = '偏好设置'
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Successfully updated zh-CN.json")
    else:
        print("Error: 'form' key not found in 'WithdrawAddresses'")
else:
    print("Error: 'WithdrawAddresses' key not found")
