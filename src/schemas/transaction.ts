import { z } from 'zod';
import { UUID, ISODate, ISODateTime, Nature, Classification, Pagination } from './common.js';

export const NestedAccount = z.object({
  id: UUID,
  name: z.string(),
  account_type: z.string(),
}).passthrough();
export type NestedAccount = z.infer<typeof NestedAccount>;

export const NestedCategory = z.object({
  id: UUID,
  name: z.string(),
  classification: Classification.optional(),
  color: z.string(),
  icon: z.string(),
}).passthrough();
export type NestedCategory = z.infer<typeof NestedCategory>;

export const NestedMerchant = z.object({
  id: UUID,
  name: z.string(),
}).passthrough();
export type NestedMerchant = z.infer<typeof NestedMerchant>;

export const NestedTag = z.object({
  id: UUID,
  name: z.string(),
  color: z.string(),
}).passthrough();
export type NestedTag = z.infer<typeof NestedTag>;

export const TransferDetail = z.object({
  id: UUID,
  amount: z.string(),
  currency: z.string(),
  other_account: NestedAccount,
}).passthrough();
export type TransferDetail = z.infer<typeof TransferDetail>;

export const Transaction = z.object({
  id: UUID,
  date: ISODate,
  amount: z.string(),
  amount_cents: z.number().int().optional(),
  signed_amount_cents: z.number().int().optional(),
  currency: z.string(),
  name: z.string(),
  notes: z.string().nullable().optional(),
  classification: z.string(),
  account: NestedAccount,
  category: NestedCategory.nullable().optional(),
  merchant: NestedMerchant.nullable().optional(),
  tags: z.array(NestedTag),
  transfer: TransferDetail.nullable().optional(),
  created_at: ISODateTime,
  updated_at: ISODateTime,
}).passthrough();
export type Transaction = z.infer<typeof Transaction>;

export const TransactionListResponse = z.object({
  transactions: z.array(Transaction),
  pagination: Pagination,
}).passthrough();
export type TransactionListResponse = z.infer<typeof TransactionListResponse>;

export const CreateTransactionInput = z.object({
  account_id: UUID,
  date: ISODate,
  amount: z.number().positive(),
  name: z.string().min(1),
  nature: Nature,
  category_id: UUID.optional(),
  merchant_id: UUID.optional(),
  tag_ids: z.array(UUID).optional(),
  notes: z.string().optional(),
});
export type CreateTransactionInput = z.infer<typeof CreateTransactionInput>;

export const UpdateTransactionInput = CreateTransactionInput.partial();
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionInput>;

export const ListTransactionsInput = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().min(1).max(100).optional(),
  account_id: UUID.optional(),
  account_ids: z.array(UUID).optional(),
  category_id: UUID.optional(),
  category_ids: z.array(UUID).optional(),
  merchant_id: UUID.optional(),
  merchant_ids: z.array(UUID).optional(),
  tag_ids: z.array(UUID).optional(),
  start_date: ISODate.optional(),
  end_date: ISODate.optional(),
  min_amount: z.number().optional(),
  max_amount: z.number().optional(),
  type: z.enum(['income', 'expense']).optional(),
  search: z.string().optional(),
});
export type ListTransactionsInput = z.infer<typeof ListTransactionsInput>;
