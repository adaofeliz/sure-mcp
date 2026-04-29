import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const deleteTagTool: ToolDefinition = {
  name: 'delete_tag',
  description: 'Permanently delete a tag. This cannot be undone.',
  inputSchema: {
    id: UUID,
  },
  annotations: { destructiveHint: true, idempotentHint: true, title: 'Delete tag' },
  async handler({ id }, { client }) {
    try {
      await client.delete(`/tags/${id}`);
      return {
        content: [{ type: 'text', text: `Tag ${id} deleted.` }],
        structuredContent: { deleted: true, id },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
