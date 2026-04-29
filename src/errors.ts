export type McpErrorResponse = {
  content: [{ type: 'text'; text: string }];
  structuredContent: { [key: string]: unknown };
  isError: true;
};

export class SureApiError extends Error {
  readonly status: number;
  readonly endpoint: string;
  readonly method: string;
  readonly body: unknown;

  constructor(opts: {
    status: number;
    endpoint: string;
    method: string;
    body: unknown;
  }) {
    const extracted = extractMessage(opts.body);
    super(
      `Sure API ${opts.method} ${opts.endpoint} failed with ${opts.status}${extracted ? ': ' + extracted : ''}`,
    );
    this.name = 'SureApiError';
    this.status = opts.status;
    this.endpoint = opts.endpoint;
    this.method = opts.method;
    this.body = opts.body;
  }
}

function extractMessage(body: unknown): string {
  if (typeof body === 'string') return body.slice(0, 200);
  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>;
    const msg = b['message'] ?? b['error'];
    if (typeof msg === 'string') return msg;
  }
  return '';
}

/**
 * Convert any thrown error into a structured MCP tool error response.
 * Returns isError: true so the LLM can self-correct.
 */
export function toMcpErrorResponse(err: unknown): McpErrorResponse {
  if (err instanceof SureApiError) {
    const bodyExcerpt =
      typeof err.body === 'string'
        ? err.body.slice(0, 1000)
        : JSON.stringify(err.body ?? {}).slice(0, 1000);

    return {
      content: [{ type: 'text', text: err.message }],
      structuredContent: {
        status: err.status,
        endpoint: err.endpoint,
        method: err.method,
        body: bodyExcerpt,
      },
      isError: true,
    };
  }

  const text =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'An unexpected error occurred';

  return {
    content: [{ type: 'text', text }],
    structuredContent: { error: text },
    isError: true,
  };
}

/**
 * Type guard for SureApiError.
 */
export function isSureApiError(err: unknown): err is SureApiError {
  return err instanceof SureApiError;
}
