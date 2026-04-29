import { z } from 'zod';
import { UUID, ISODateTime } from './common.js';

export const MerchantType = z.enum(['FamilyMerchant', 'ProviderMerchant']);
export type MerchantType = z.infer<typeof MerchantType>;

export const Merchant = z.object({
  id: UUID,
  name: z.string(),
  type: MerchantType,
  created_at: ISODateTime,
  updated_at: ISODateTime,
}).passthrough();
export type Merchant = z.infer<typeof Merchant>;

/** Merchants endpoint returns a bare array (no pagination wrapper) */
export const MerchantListResponse = z.array(Merchant);
export type MerchantListResponse = z.infer<typeof MerchantListResponse>;

export const GetMerchantInput = z.object({ id: UUID });
export type GetMerchantInput = z.infer<typeof GetMerchantInput>;
