export type ApiErrorKind =
  | "auth"
  | "permission"
  | "validation"
  | "conflict"
  | "rate-limit"
  | "not-found"
  | "system"
  | "business";

export type ApiResponseLike = {
  code: number;
  message?: string;
  data?: unknown;
  timestamp?: string;
};

export type ApiClientErrorOptions = {
  code?: number;
  status?: number;
  message?: string;
  data?: unknown;
  response?: unknown;
  cause?: unknown;
};

export class ApiClientError extends Error {
  code?: number;
  status?: number;
  data?: unknown;
  response?: unknown;
  kind: ApiErrorKind;
  isApiClientError = true;

  constructor(options: ApiClientErrorOptions) {
    const message = getApiErrorMessage(options);
    super(message);
    this.name = "ApiClientError";
    this.code = options.code;
    this.status = options.status;
    this.data = options.data;
    this.response = options.response;
    this.kind = getApiErrorKind(options.code, options.status);
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export const API_SUCCESS_CODE = 0;
const LEGACY_SUCCESS_CODE = 200;

export const AUTH_EXPIRED_CODES = new Set([401, 20011, 20012, 80004]);

export const API_ERROR_MESSAGES: Record<number, string> = {
  400: "请求参数错误",
  401: "未登录或登录已过期",
  403: "无权限访问",
  404: "资源不存在",
  422: "参数校验失败",
  500: "系统异常，请稍后重试",
  10000: "业务处理失败",
  10001: "余额不足",
  10002: "重复操作",
  10003: "请求过于频繁",
  10004: "请求体格式错误",
  10005: "缺少必填参数",
  10006: "请求参数格式错误",
  11001: "钱包不存在",
  11002: "钱包已禁用",
  11003: "金额无效",
  11004: "数据状态已变化，请刷新后重试",
  11005: "钱包业务类型和业务订单号不能为空",
  11006: "钱包幂等键重复",
  20001: "邮箱已注册",
  20002: "邮箱未注册",
  20003: "邮箱或密码错误",
  20004: "用户已禁用",
  20005: "邮箱验证码无效或已过期",
  20006: "邮箱验证码发送过于频繁",
  20007: "邮箱验证码尝试次数过多",
  20008: "邮箱验证码限流不可用",
  20009: "邮箱验证码尝试限制不可用",
  20010: "邀请码无效",
  20011: "登录令牌无效",
  20012: "请先登录",
  20013: "用户不存在",
  30001: "地区不存在",
  30002: "GPU 型号不存在",
  30003: "产品不存在",
  30004: "AI 模型不存在",
  30005: "租赁周期规则不存在",
  30006: "产品所属地区不可用",
  30007: "产品 GPU 型号不可用",
  31001: "博客文章不存在",
  31002: "博客分类不存在",
  31003: "博客标签不存在",
  32001: "文档分类存在子分类，不能删除",
  32002: "文档分类存在文章，不能删除",
  32003: "文档文章不存在",
  32004: "文档分类不存在",
  32005: "文档分类父级不能形成循环",
  32006: "文档分类编码已存在",
  32007: "文档文章 slug 已存在",
  32008: "状态无效",
  32009: "发布状态无效",
  32010: "缺少必填字段",
  40001: "租赁订单不存在",
  40002: "仅待支付租赁订单可支付",
  40003: "当前租赁订单状态不可取消",
  40004: "仅待激活租赁订单可支付部署费用",
  40005: "仅已暂停租赁订单可启动",
  40006: "仅运行中或已暂停租赁订单可提前结算",
  40007: "租赁订单正在处理，请稍后重试",
  41001: "API 凭证不存在",
  41002: "仅已生成的 API 凭证可激活",
  41003: "仅已暂停 API 凭证可启动",
  41004: "API 凭证未处于激活中",
  41005: "API 凭证已存在",
  41101: "API 部署订单不存在",
  41102: "API 部署订单已存在",
  41103: "API 部署订单状态已变化",
  41104: "API 凭证状态已变化",
  41201: "API Token 明文不能为空",
  41202: "API Token 加密失败",
  41203: "API Token 加密密钥未配置",
  42001: "收益记录不存在",
  43001: "结算订单不存在",
  44001: "佣金记录不存在",
  60001: "充值渠道编码重复",
  60002: "充值渠道已有订单引用，不能删除",
  60003: "充值金额必须大于 0",
  60004: "充值金额低于最低金额",
  60005: "充值订单或外部交易号重复",
  60006: "仅已提交充值订单可取消",
  60007: "仅已提交充值订单可审核通过",
  60008: "仅已提交充值订单可驳回",
  60009: "充值订单状态已变化",
  60010: "充值渠道不可用",
  60011: "充值渠道不存在",
  60012: "外部交易号重复",
  60013: "充值订单不存在",
  60014: "最小充值金额不能大于最大充值金额",
  60015: "充值订单正在处理，请稍后重试",
  70001: "提现地址无效",
  70002: "提现金额低于最低金额",
  70003: "已超过每日提现限额",
  70004: "仅待处理提现订单可取消",
  70005: "仅待处理提现订单可审核通过",
  70006: "仅待处理或已审核提现订单可驳回",
  70007: "仅已审核提现订单可标记打款",
  70008: "提现订单状态已变化",
  70009: "提现订单不存在",
  70010: "提现订单正在处理，请稍后重试",
  80001: "用户名或密码错误",
  80002: "管理员账号已禁用",
  80003: "用户名已存在",
  80004: "管理员不存在",
  80005: "需要管理员令牌",
  80010: "缺少系统配置",
  80011: "系统配置不存在",
  80012: "系统配置更新失败",
  80013: "管理员日志不存在",
  80020: "通知不存在",
};

export function isApiResponseLike(value: unknown): value is ApiResponseLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as { code: unknown }).code === "number"
  );
}

export function isSuccessApiCode(code: number | undefined): boolean {
  return code === API_SUCCESS_CODE || code === LEGACY_SUCCESS_CODE;
}

export function getApiErrorKind(
  code: number | undefined,
  status: number | undefined,
): ApiErrorKind {
  if (status === 401 || AUTH_EXPIRED_CODES.has(code ?? -1)) return "auth";
  if (status === 403 || code === 403 || code === 20004 || code === 80002 || code === 80005) {
    return "permission";
  }
  if (status === 422 || code === 422) return "validation";
  if (status === 409 || code === 10002 || code === 11004 || code === 11006) return "conflict";
  if (status === 429 || code === 10003 || code === 20006 || code === 20007) return "rate-limit";
  if (status === 404 || code === 404) return "not-found";
  if ((status && status >= 500) || (code && [20008, 20009, 41202, 41203, 80010].includes(code))) {
    return "system";
  }
  if (code && [40007, 60015, 70010].includes(code)) return "conflict";
  return "business";
}

export function getApiErrorMessage(options: {
  code?: number;
  status?: number;
  message?: string;
}): string {
  if (options.code && API_ERROR_MESSAGES[options.code]) {
    return API_ERROR_MESSAGES[options.code];
  }
  if (options.status && API_ERROR_MESSAGES[options.status]) {
    return API_ERROR_MESSAGES[options.status];
  }
  if (options.message?.trim()) {
    return options.message.trim();
  }
  if (options.status && options.status >= 500) {
    return API_ERROR_MESSAGES[500];
  }
  return "请求失败，请稍后重试";
}

export function createApiClientError(options: ApiClientErrorOptions): ApiClientError {
  return new ApiClientError(options);
}

export function shouldClearAuthSession(code: number | undefined, status: number | undefined): boolean {
  return status === 401 || AUTH_EXPIRED_CODES.has(code ?? -1);
}

export function getValidationErrors(data: unknown): Record<string, string> {
  if (!data || typeof data !== "object") return {};
  return Object.entries(data as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (typeof value === "string") acc[key] = value;
      else if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        acc[key] = value.join("，");
      }
      return acc;
    },
    {},
  );
}

export function extractApiClientError(error: unknown): ApiClientError | null {
  if (error instanceof ApiClientError) return error;
  if (typeof error !== "object" || error === null) return null;

  const maybeError = error as {
    code?: unknown;
    status?: unknown;
    response?: { status?: unknown; data?: unknown };
    message?: unknown;
  };
  const responseData = maybeError.response?.data;
  if (isApiResponseLike(responseData)) {
    return createApiClientError({
      code: responseData.code,
      status: typeof maybeError.response?.status === "number" ? maybeError.response.status : undefined,
      message: responseData.message,
      data: responseData.data,
      response: responseData,
      cause: error,
    });
  }

  if (typeof maybeError.code === "number" || typeof maybeError.status === "number") {
    return createApiClientError({
      code: typeof maybeError.code === "number" ? maybeError.code : undefined,
      status: typeof maybeError.status === "number" ? maybeError.status : undefined,
      message: typeof maybeError.message === "string" ? maybeError.message : undefined,
      cause: error,
    });
  }

  return null;
}
