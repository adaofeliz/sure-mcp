import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const deleteTransactionTool: ToolDefinition = {
  name: 'delete_transaction',
  description: 'Permanently delete a transaction. This cannot be undone.',
  inputSchema: {
    id: UUID,
  },
  annotations: { destructiveHint: true, idempotentHint: true, title: 'Delete transaction' },
  async handler({ id }, { client }) {
    try {
      await client.delete(`/transactions/${id}`);
      return {
        content: [{ type: 'text', text: `Transaction ${id} deleted.` }],
        structuredContent: { deleted: true, id },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
