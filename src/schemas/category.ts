import { z } from 'zod';
import { UUID, ISODateTime, Classification, Pagination } from './common.js';

export const CategoryParent = z.object({
  id: UUID,
  name: z.string(),
}).passthrough();
export type CategoryParent = z.infer<typeof CategoryParent>;

export const Category = z.object({
  id: UUID,
  name: z.string(),
  classification: Classification.optional(),
  color: z.string(),
  icon: z.string(),
  parent: CategoryParent.nullable().optional(),
  subcategories_count: z.number().int().nonnegative().optional(),
  created_at: ISODateTime,
  updated_at: ISODateTime,
}).passthrough();
export type Category = z.infer<typeof Category>;

export const CategoryListResponse = z.object({
  categories: z.array(Category),
  pagination: Pagination,
}).passthrough();
export type CategoryListResponse = z.infer<typeof CategoryListResponse>;

export const ListCategoriesInput = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().min(1).max(100).optional(),
  classification: Classification.optional(),
  roots_only: z.boolean().optional(),
  parent_id: UUID.optional(),
});
export type ListCategoriesInput = z.infer<typeof ListCategoriesInput>;

export const GetCategoryInput = z.object({ id: UUID });
export type GetCategoryInput = z.infer<typeof GetCategoryInput>;
