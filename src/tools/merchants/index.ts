import { listMerchantsTool } from './list.js';
import { getMerchantTool } from './get.js';
import type { ToolDefinition } from '../shared.js';

export const merchantTools: ToolDefinition[] = [listMerchantsTool, getMerchantTool];
