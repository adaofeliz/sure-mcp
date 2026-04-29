import { z } from 'zod';
import { MerchantListResponse } from '../../schemas/merchant.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const listMerchantsTool: ToolDefinition = {
  name: 'list_merchants',
  description:
    'List all merchants available to the family. Returns both FamilyMerchant (user-created) and ProviderMerchant (external, e.g. from Plaid) types. Merchants are read-only via API.',
  inputSchema: {
    _noInput: z.boolean().optional().describe('No input required — leave unset'),
  },
  annotations: { readOnlyHint: true, title: 'List merchants' },
  async handler(_args, { client }) {
    try {
      const data = await client.get('/merchants');
      const parsed = MerchantListResponse.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: { merchants: parsed },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
