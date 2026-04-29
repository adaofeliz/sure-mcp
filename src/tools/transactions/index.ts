import { listTransactionsTool } from './list.js';
import { getTransactionTool } from './get.js';
import { createTransactionTool } from './create.js';
import { updateTransactionTool } from './update.js';
import { deleteTransactionTool } from './delete.js';
import type { ToolDefinition } from '../shared.js';

export const transactionTools: ToolDefinition[] = [
  listTransactionsTool,
  getTransactionTool,
  createTransactionTool,
  updateTransactionTool,
  deleteTransactionTool,
];
