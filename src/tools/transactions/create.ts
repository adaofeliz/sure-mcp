import { z } from 'zod';
import { UUID, ISODate, Nature } from '../../schemas/common.js';
import { Transaction } from '../../schemas/transaction.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const createTransactionTool: ToolDefinition = {
  name: 'create_transaction',
  description:
    'Create a new transaction on a specific account. Required: account_id, date (YYYY-MM-DD), amount (positive number), name, nature (income|inflow|expense|outflow). Optional: category_id, merchant_id, tag_ids[], notes.',
  inputSchema: {
    account_id: UUID,
    date: ISODate,
    amount: z.number().positive(),
    name: z.string().min(1),
    nature: Nature,
    category_id: UUID.optional(),
    merchant_id: UUID.optional(),
    tag_ids: z.array(UUID).optional(),
    notes: z.string().optional(),
  },
  annotations: { destructiveHint: false, idempotentHint: false, title: 'Create transaction' },
  async handler(args, { client }) {
    try {
      const data = await client.post('/transactions', { transaction: args });
      const parsed = Transaction.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
