import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { Merchant } from '../../schemas/merchant.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const getMerchantTool: ToolDefinition = {
  name: 'get_merchant',
  description:
    'Retrieve a single merchant by ID, including type (FamilyMerchant | ProviderMerchant). Merchants are read-only via API.',
  inputSchema: { id: UUID },
  annotations: { readOnlyHint: true, title: 'Get merchant' },
  async handler({ id }, { client }) {
    try {
      const data = await client.get(`/merchants/${id}`);
      const parsed = Merchant.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
