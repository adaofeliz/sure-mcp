import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SureClient } from '../client.js';
import { transactionTools } from './transactions/index.js';
import { tagTools } from './tags/index.js';
import { categoryTools } from './categories/index.js';
import { merchantTools } from './merchants/index.js';
import { accountTools } from './accounts/index.js';
import type { ToolDefinition } from './shared.js';

export const allTools: ToolDefinition[] = [
  ...transactionTools,
  ...tagTools,
  ...categoryTools,
  ...merchantTools,
  ...accountTools,
];

const EXPECTED_TOOL_COUNT = 16;

export function registerAllTools(server: McpServer, client: SureClient): void {
  if (allTools.length !== EXPECTED_TOOL_COUNT) {
    throw new Error(
      `Tool count mismatch: expected ${EXPECTED_TOOL_COUNT}, got ${allTools.length}. ` +
        `Check src/tools/*/index.ts for missing or duplicate tools.`,
    );
  }

  for (const tool of allTools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
        ...(tool.annotations ? { annotations: tool.annotations } : {}),
      },
      async (args) => tool.handler(args as Record<string, unknown>, { client }),
    );
  }

  console.error(`[sure-mcp] Registered ${allTools.length} tools`);
}
