import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { Transaction } from '../../schemas/transaction.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const getTransactionTool: ToolDefinition = {
  name: 'get_transaction',
  description:
    'Retrieve a single transaction by ID with full nested details (account, category, merchant, tags, transfer).',
  inputSchema: {
    id: UUID,
  },
  annotations: { readOnlyHint: true, title: 'Get transaction' },
  async handler({ id }, { client }) {
    try {
      const data = await client.get(`/transactions/${id}`);
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
