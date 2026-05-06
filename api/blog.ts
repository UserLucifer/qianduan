import { apiGet } from "./http";
import type { AxiosRequestConfig } from "axios";
import type {
  BlogCategoryResponse,
  BlogPostQueryRequest,
  BlogPostResponse,
  BlogTagResponse,
  LocaleQuery,
  PageResult,
} from "./types";

export type {
  BlogCategoryResponse,
  BlogPostQueryRequest,
  BlogPostResponse,
  BlogTagResponse,
  LocaleQuery,
  PageResult,
};

export const getBlogCategories = (params: LocaleQuery = {}) =>
  apiGet<BlogCategoryResponse[]>("/api/blog/categories", { params });

export const getBlogTags = (params: LocaleQuery = {}) =>
  apiGet<BlogTagResponse[]>("/api/blog/tags", { params });

export const getBlogPosts = (
  params: BlogPostQueryRequest = {},
  config?: AxiosRequestConfig,
) =>
  apiGet<PageResult<BlogPostResponse>>("/api/blog/posts", { ...config, params });

export const getBlogPostBySlug = (id: string | number, params: LocaleQuery = {}) =>
  apiGet<BlogPostResponse>(`/api/blog/posts/${id}`, { params });
