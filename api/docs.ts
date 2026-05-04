import { apiGet } from "./http";
import type {
  DocsArticle,
  DocsArticleQuery,
  DocsCategory,
  DocsLanguage,
  DocsSection,
  PageResult,
} from "./types";

export type {
  DocsArticle,
  DocsArticleQuery,
  DocsCategory,
  DocsLanguage,
  DocsSection,
  PageResult,
};

export const getDocsCategories = (params: { section?: DocsSection; language?: DocsLanguage } = {}) =>
  apiGet<DocsCategory[]>("/api/docs/categories", { params });

export const getDocsArticles = (params: DocsArticleQuery = {}) =>
  apiGet<PageResult<DocsArticle>>("/api/docs/articles", { params });

export const getDocsArticleById = (id: string | number, params: { language?: DocsLanguage } = {}) =>
  apiGet<DocsArticle>(`/api/docs/articles/${id}`, { params });

export const getDocsArticleBySlug = (slug: string, params: { language?: DocsLanguage } = {}) =>
  apiGet<DocsArticle>(`/api/docs/articles/slug/${slug}`, { params });

export const getDocsSectionHome = (section: DocsSection, params: { language?: DocsLanguage } = {}) =>
  apiGet<DocsArticle>(`/api/docs/articles/section/${section}/home`, { params });

export const searchDocs = (params: DocsArticleQuery = {}) =>
  apiGet<PageResult<DocsArticle>>("/api/docs/search", { params });
