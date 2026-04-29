import { listCategoriesTool } from './list.js';
import { getCategoryTool } from './get.js';
import type { ToolDefinition } from '../shared.js';

export const categoryTools: ToolDefinition[] = [listCategoriesTool, getCategoryTool];
