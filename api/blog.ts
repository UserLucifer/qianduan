import { apiGet } from "./http";
import type { AxiosRequestConfig } from "axios";
import type {
  BlogCategoryResponse,
  BlogPostQueryRequest,
  BlogPostResponse,
  BlogTagResponse,
  PageResult,
} from "./types";

export type {
  BlogCategoryResponse,
  BlogPostQueryRequest,
  BlogPostResponse,
  BlogTagResponse,
  PageResult,
};

export const getBlogCategories = () =>
  apiGet<BlogCategoryResponse[]>("/api/blog/categories");

export const getBlogTags = () =>
  apiGet<BlogTagResponse[]>("/api/blog/tags");

export const getBlogPosts = (
  params: BlogPostQueryRequest = {},
  config?: AxiosRequestConfig,
) =>
  apiGet<PageResult<BlogPostResponse>>("/api/blog/posts", { ...config, params });

export const getBlogPostBySlug = (id: string | number) =>
  apiGet<BlogPostResponse>(`/api/blog/posts/${id}`);
