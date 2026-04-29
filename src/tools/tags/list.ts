import { z } from 'zod';
import { TagListResponse } from '../../schemas/tag.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const listTagsTool: ToolDefinition = {
  name: 'list_tags',
  description:
    'List all tags. Returns a bare array of tags (no pagination). Tags can be assigned to transactions to organize and filter them.',
  inputSchema: {
    _noInput: z.boolean().optional().describe('No input required — leave unset'),
  },
  annotations: { readOnlyHint: true, title: 'List tags' },
  async handler(_args, { client }) {
    try {
      const data = await client.get('/tags');
      const parsed = TagListResponse.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: { tags: parsed },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
