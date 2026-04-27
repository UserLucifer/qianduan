"use client";

/**
 * 通用 Fetcher 函数，为 Spring Boot 后端设计
 * 包含 Authorization: Bearer <token>
 */
export async function apiFetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    // 处理常见的 HTTP 错误
    if (response.status === 401) {
      // Token 过期或无效，可在此跳转登录
      console.error('Unauthorized: Please login again.');
    }
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
