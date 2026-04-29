import { z } from 'zod';
import { UUID } from '../../schemas/common.js';
import { Category } from '../../schemas/category.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const getCategoryTool: ToolDefinition = {
  name: 'get_category',
  description:
    'Retrieve a single category by ID, including parent (if any) and subcategories_count. Categories are read-only via API.',
  inputSchema: { id: UUID },
  annotations: { readOnlyHint: true, title: 'Get category' },
  async handler({ id }, { client }) {
    try {
      const data = await client.get(`/categories/${id}`);
      const parsed = Category.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
