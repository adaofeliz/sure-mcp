import { z } from 'zod';

const ConfigSchema = z.object({
  SURE_URL: z.string().url('SURE_URL must be a valid URL (e.g. https://sure.example.com)'),
  SURE_API_KEY: z.string().min(1, 'SURE_API_KEY must not be empty'),
});

export type Config = {
  baseUrl: string;
  apiKey: string;
};

/**
 * Load and validate configuration from environment variables.
 * Throws a descriptive error if required variables are missing or invalid.
 *
 * Required env vars:
 *   SURE_URL     - Base URL of your Sure instance (e.g. https://sure.example.com)
 *   SURE_API_KEY - API key from your Sure account settings
 *
 * Example MCP client config:
 *   {
 *     "mcpServers": {
 *       "sure": {
 *         "command": "npx",
 *         "args": ["-y", "@adflz/sure-mcp"],
 *         "env": {
 *           "SURE_URL": "https://sure.example.com",
 *           "SURE_API_KEY": "<your-sure-api-key>"
 *         }
 *       }
 *     }
 *   }
 */
export function loadConfig(): Config {
  const result = ConfigSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(
      `sure-mcp: missing or invalid environment variables:\n${issues}\n\n` +
        `Set them in your MCP client config under "env":\n` +
        `  SURE_URL=https://sure.example.com\n` +
        `  SURE_API_KEY=<your-sure-api-key>`,
    );
  }

  const { SURE_URL, SURE_API_KEY } = result.data;

  // Normalize: strip trailing slash, append /api/v1
  const baseUrl = SURE_URL.replace(/\/+$/, '') + '/api/v1';

  return { baseUrl, apiKey: SURE_API_KEY };
}
