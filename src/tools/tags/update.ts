import { z } from 'zod';
import { UUID, HexColor } from '../../schemas/common.js';
import { Tag } from '../../schemas/tag.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const updateTagTool: ToolDefinition = {
  name: 'update_tag',
  description: 'Update a tag name or color. Both fields are optional.',
  inputSchema: {
    id: UUID,
    name: z.string().min(1).optional(),
    color: HexColor.optional(),
  },
  annotations: { idempotentHint: true, destructiveHint: false, title: 'Update tag' },
  async handler({ id, ...rest }, { client }) {
    try {
      const data = await client.patch(`/tags/${id}`, { tag: rest });
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
