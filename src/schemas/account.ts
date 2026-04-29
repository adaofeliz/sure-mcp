import { z } from 'zod';
import { UUID, ISODateTime, Pagination } from './common.js';

/** Soft schema — accounts endpoint not fully documented; passthrough for forward-compat */
export const Account = z.object({
  id: UUID,
  name: z.string(),
  account_type: z.string().optional(),
  balance: z.string().optional(),
  currency: z.string().optional(),
  created_at: ISODateTime.optional(),
  updated_at: ISODateTime.optional(),
}).passthrough();
export type Account = z.infer<typeof Account>;

/**
 * Accounts endpoint may return either a bare array or a paginated wrapper.
 * Use union to handle both shapes.
 */
export const AccountListResponse = z.union([
  z.array(Account),
  z.object({ accounts: z.array(Account), pagination: Pagination }).passthrough(),
]);
export type AccountListResponse = z.infer<typeof AccountListResponse>;

export const GetAccountInput = z.object({ id: UUID });
export type GetAccountInput = z.infer<typeof GetAccountInput>;

export const ListAccountsInput = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().min(1).max(100).optional(),
});
export type ListAccountsInput = z.infer<typeof ListAccountsInput>;
