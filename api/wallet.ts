import { apiGet } from "./http";
import type {
  PageResult,
  WalletMeResponse,
  WalletTransactionQueryRequest,
  WalletTransactionResponse,
} from "./types";

export type { WalletMeResponse, WalletTransactionQueryRequest, WalletTransactionResponse };

export const getWalletInfo = () =>
  apiGet<WalletMeResponse>("/api/wallet/me");

export const getTransactions = (params: WalletTransactionQueryRequest = {}) =>
  apiGet<PageResult<WalletTransactionResponse>>("/api/wallet/transactions", { params });
