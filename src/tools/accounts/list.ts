import { z } from 'zod';
import { AccountListResponse } from '../../schemas/account.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const listAccountsTool: ToolDefinition = {
  name: 'list_accounts',
  description:
    'List all financial accounts belonging to the family (checking, savings, credit card, investment, etc.). Use this to resolve account names to IDs when creating transactions — create_transaction requires account_id.',
  inputSchema: {
    page: z.number().int().positive().optional(),
    per_page: z.number().int().min(1).max(100).optional(),
  },
  annotations: { readOnlyHint: true, title: 'List accounts' },
  async handler(args, { client }) {
    try {
      const data = await client.get('/accounts', args as Record<string, string | number | boolean | string[] | undefined>);
      const parsed = AccountListResponse.parse(data);
      // Normalize: always return an object (MCP structuredContent must be a record, not array)
      const normalized = Array.isArray(parsed) ? { accounts: parsed } : parsed;
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: normalized as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
