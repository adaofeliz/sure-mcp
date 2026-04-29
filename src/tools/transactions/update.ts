import { z } from 'zod';
import { UUID, ISODate, Nature } from '../../schemas/common.js';
import { Transaction } from '../../schemas/transaction.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const updateTransactionTool: ToolDefinition = {
  name: 'update_transaction',
  description:
    'Update fields of an existing transaction. Use to assign/change category, merchant, tags, or edit name/notes/date/amount. All body fields optional.',
  inputSchema: {
    id: UUID,
    account_id: UUID.optional(),
    date: ISODate.optional(),
    amount: z.number().positive().optional(),
    name: z.string().min(1).optional(),
    nature: Nature.optional(),
    category_id: UUID.optional(),
    merchant_id: UUID.optional(),
    tag_ids: z.array(UUID).optional(),
    notes: z.string().optional(),
  },
  annotations: { idempotentHint: true, destructiveHint: false, title: 'Update transaction' },
  async handler({ id, ...rest }, { client }) {
    try {
      const data = await client.patch(`/transactions/${id}`, { transaction: rest });
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
