import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { Tag } from '../../schemas/tag.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const getTagTool: ToolDefinition = {
  name: 'get_tag',
  description: 'Retrieve a single tag by ID.',
  inputSchema: {
    id: UUID,
  },
  annotations: { readOnlyHint: true, title: 'Get tag' },
  async handler({ id }, { client }) {
    try {
      const data = await client.get(`/tags/${id}`);
      const parsed = Tag.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
