
import json
import os

files = [
    (r'e:\业务开发\qianduan\messages\zh-CN.json', '已取消申请。'),
    (r'e:\业务开发\qianduan\messages\en-US.json', 'Withdrawal request cancelled.')
]

for path, msg in files:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'DashboardWithdraw' in data:
        if 'messages' in data['DashboardWithdraw']:
            data['DashboardWithdraw']['messages']['cancelled'] = msg
            
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Successfully updated {os.path.basename(path)}")
        else:
            print(f"Error: 'messages' key not found in 'DashboardWithdraw' for {path}")
    else:
        print(f"Error: 'DashboardWithdraw' key not found for {path}")
