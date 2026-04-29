import { z } from 'zod';
import { UUID, ISODate } from '../../schemas/common.js';
import { TransactionListResponse } from '../../schemas/transaction.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const listTransactionsTool: ToolDefinition = {
  name: 'list_transactions',
  description:
    'List transactions with filtering and pagination. Returns paginated transactions with nested account, category, merchant, and tags. Use for querying by date range, amount, account, category, merchant, tag, nature (income/expense), or free-text search across name/notes/merchant.',
  inputSchema: {
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
  },
  annotations: { readOnlyHint: true, title: 'List transactions' },
  async handler(args, { client }) {
    try {
      const data = await client.get('/transactions', args as Record<string, string | number | boolean | string[] | undefined>);
      const parsed = TransactionListResponse.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
