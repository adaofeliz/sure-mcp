import { z } from 'zod';
import { HexColor } from '../../schemas/common.js';
import { Tag } from '../../schemas/tag.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const createTagTool: ToolDefinition = {
  name: 'create_tag',
  description:
    'Create a new tag. Name must be unique. Color is optional — if omitted, the server assigns one from a predefined palette. Color must be a hex string like #6471eb.',
  inputSchema: {
    name: z.string().min(1, 'Tag name must not be empty'),
    color: HexColor.optional(),
  },
  annotations: { destructiveHint: false, idempotentHint: false, title: 'Create tag' },
  async handler(args, { client }) {
    try {
      const data = await client.post('/tags', { tag: args });
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
