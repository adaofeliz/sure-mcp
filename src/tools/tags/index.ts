import { listTagsTool } from './list.js';
import { getTagTool } from './get.js';
import { createTagTool } from './create.js';
import { updateTagTool } from './update.js';
import { deleteTagTool } from './delete.js';
import type { ToolDefinition } from '../shared.js';

export const tagTools: ToolDefinition[] = [
  listTagsTool,
  getTagTool,
  createTagTool,
  updateTagTool,
  deleteTagTool,
];
