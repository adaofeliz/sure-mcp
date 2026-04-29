import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  let server;

  try {
    const config = loadConfig();
    server = createServer(config);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[sure-mcp] Connected via stdio');
  } catch (err) {
    console.error(
      '[sure-mcp] Fatal:',
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  }

  const shutdown = async (): Promise<void> => {
    console.error('[sure-mcp] Shutting down...');
    try {
      await server?.close();
    } catch {
      // ignore close errors during shutdown
    }
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

void main();
