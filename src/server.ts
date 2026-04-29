import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClient } from './client.js';
import { registerAllTools } from './tools/index.js';
import type { Config } from './config.js';

export function createServer(config: Config): McpServer {
  const server = new McpServer(
    { name: 'sure-mcp', version: '0.1.0' },
    {
      instructions:
        'Use list_accounts to resolve account names to IDs before creating transactions. ' +
        'Use list_categories and list_merchants to find IDs for filtering or assigning. ' +
        'Categories and merchants are read-only via API — create them in the Sure web UI. ' +
        'Do not retry failed requests — surface errors to the user.',
    },
  );

  const client = createClient(config);
  registerAllTools(server, client);

  return server;
}
