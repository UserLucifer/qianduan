
import json
import os

zh_data = {
    "security": {
        "title": "提现安全验证",
        "description": "为保障您的资金安全，本次提现需进行多重身份验证。",
        "emailCode": "邮箱/手机验证码",
        "emailCodePlaceholder": "6位验证码",
        "googleCode": "谷歌验证器 (2FA)",
        "googleCodePlaceholder": "输入6位谷歌动态码",
        "disabled": "暂未开启",
        "getCode": "获取验证码",
        "safeAcknowledgment": "我已核对收款地址及网络无误，知晓转账操作不可逆转且无法找回。",
        "cancel": "返回修改",
        "confirm": "确认提现申请"
    },
    "toasts": {
        "codeSent": "验证码已发送至您的密保邮箱/手机。"
    }
}

en_data = {
    "security": {
        "title": "Withdrawal Security",
        "description": "For your fund safety, multi-factor authentication is required for this withdrawal.",
        "emailCode": "Email/SMS Code",
        "emailCodePlaceholder": "6-digit code",
        "googleCode": "Google Authenticator (2FA)",
        "googleCodePlaceholder": "Enter 6-digit code",
        "disabled": "Disabled",
        "getCode": "Get Code",
        "safeAcknowledgment": "I have verified the recipient address and network, and I understand that this transfer is irreversible.",
        "cancel": "Cancel",
        "confirm": "Confirm Withdrawal"
    },
    "toasts": {
        "codeSent": "Verification code has been sent to your email/phone."
    }
}

files = [
    (r'e:\业务开发\qianduan\messages\zh-CN.json', zh_data),
    (r'e:\业务开发\qianduan\messages\en-US.json', en_data)
]

for path, updates in files:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'DashboardWithdraw' in data:
        data['DashboardWithdraw'].update(updates)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Successfully updated {os.path.basename(path)}")
    else:
        print(f"Error: 'DashboardWithdraw' key not found for {path}")
