import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { Account } from '../../schemas/account.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const getAccountTool: ToolDefinition = {
  name: 'get_account',
  description: 'Retrieve a single account by ID.',
  inputSchema: { id: UUID },
  annotations: { readOnlyHint: true, title: 'Get account' },
  async handler({ id }, { client }) {
    try {
      const data = await client.get(`/accounts/${id}`);
      const parsed = Account.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
