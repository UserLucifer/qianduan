
import json
import os

zh_data = {
    "withdrawalAction": "提现操作",
    "all": "全部",
    "previewTitle": "结算预检",
    "previewAmount": "提现金额",
    "previewFee": "预计手续费",
    "actualCredit": "实际到账",
    "previewHint": "* 最终到账金额以链上记录为准",
    "safetyTitle": "提现安全须知",
    "safety1": "请务必核对收款地址是否正确，转错账将无法找回。",
    "safety2": "提现申请提交后需经人工审核，通常 1-2 小时内到账。",
    "safety3": "单笔最低提现额度为 10 USDT。",
    "accountNamePlaceholder": "输入收款人姓名或别名",
    "accountNoPlaceholder": "输入 USDT 收款地址",
    "amountPlaceholder": "0.00"
}

en_data = {
    "withdrawalAction": "Withdrawal Action",
    "all": "All",
    "previewTitle": "Settlement Preview",
    "previewAmount": "Withdrawal Amount",
    "previewFee": "Estimated Fee",
    "actualCredit": "Actual Credit",
    "previewHint": "* Final amount depends on blockchain records",
    "safetyTitle": "Withdrawal Safety Guide",
    "safety1": "Please double-check the recipient address; transfers to wrong addresses cannot be recovered.",
    "safety2": "Withdrawal requests require manual review, usually completed within 1-2 hours.",
    "safety3": "Minimum withdrawal amount is 10 USDT.",
    "accountNamePlaceholder": "Enter recipient name or alias",
    "accountNoPlaceholder": "Enter USDT recipient address",
    "amountPlaceholder": "0.00"
}

files = [
    (r'e:\业务开发\qianduan\messages\zh-CN.json', zh_data, "提现金额不得低于 {amount} USDT。"),
    (r'e:\业务开发\qianduan\messages\en-US.json', en_data, "Minimum withdrawal amount is {amount} USDT.")
]

for path, form_updates, min_error in files:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'DashboardWithdraw' in data:
        # Update form
        if 'form' not in data['DashboardWithdraw']:
            data['DashboardWithdraw']['form'] = {}
        data['DashboardWithdraw']['form'].update(form_updates)
        
        # Update errors
        if 'errors' not in data['DashboardWithdraw']:
            data['DashboardWithdraw']['errors'] = {}
        data['DashboardWithdraw']['errors']['minAmountLimit'] = min_error
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Successfully updated {os.path.basename(path)}")
    else:
        print(f"Error: 'DashboardWithdraw' key not found for {path}")
