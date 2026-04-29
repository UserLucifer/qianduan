import { apiGet } from "./http";
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

export const getBlogPosts = (params: BlogPostQueryRequest = {}) =>
  apiGet<PageResult<BlogPostResponse>>("/api/blog/posts", { params });

export const getBlogPostBySlug = (id: string | number) =>
  apiGet<BlogPostResponse>(`/api/blog/posts/${id}`);
