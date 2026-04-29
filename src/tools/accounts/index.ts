import { listAccountsTool } from './list.js';
import { getAccountTool } from './get.js';
import type { ToolDefinition } from '../shared.js';

export const accountTools: ToolDefinition[] = [listAccountsTool, getAccountTool];
