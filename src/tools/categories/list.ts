import { z } from 'zod';
import { UUID, Classification } from '../../schemas/common.js';
import { CategoryListResponse } from '../../schemas/category.js';
import { toMcpErrorResponse } from '../../errors.js';
import type { ToolDefinition } from '../shared.js';

export const listCategoriesTool: ToolDefinition = {
  name: 'list_categories',
  description:
    'List categories with filtering (classification=income|expense, roots_only, parent_id) and pagination. Two-level hierarchy: root categories have parent=null, subcategories have a parent{id,name}. Categories are read-only via API.',
  inputSchema: {
    page: z.number().int().positive().optional(),
    per_page: z.number().int().min(1).max(100).optional(),
    classification: Classification.optional(),
    roots_only: z.boolean().optional(),
    parent_id: UUID.optional(),
  },
  annotations: { readOnlyHint: true, title: 'List categories' },
  async handler(args, { client }) {
    try {
      const data = await client.get('/categories', args as Record<string, string | number | boolean | string[] | undefined>);
      const parsed = CategoryListResponse.parse(data);
      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as { [key: string]: unknown },
      };
    } catch (err) {
      return toMcpErrorResponse(err);
    }
  },
};
