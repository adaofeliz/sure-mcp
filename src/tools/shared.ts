import type { z } from 'zod';
import type { SureClient } from '../client.js';

export type ToolContext = {
  client: SureClient;
};

export type ToolHandler = (
  args: Record<string, unknown>,
  ctx: ToolContext,
) => Promise<ToolResult>;

export type ToolResult = {
  content: [{ type: 'text'; text: string }];
  structuredContent?: { [key: string]: unknown };
  isError?: boolean;
};

export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: z.ZodRawShape;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  };
  handler: ToolHandler;
};
