import { SureApiError } from './errors.js';

export type QueryParams = Record<
  string,
  string | number | boolean | string[] | undefined
>;

export class SureClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: { baseUrl: string; apiKey: string }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  private buildUrl(path: string, query?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;

        if (Array.isArray(value)) {
          // Rails strong_parameters expects bracket-repeat: ?tag_ids[]=a&tag_ids[]=b
          for (const item of value) {
            url.searchParams.append(`${key}[]`, item);
          }
        } else if (typeof value === 'boolean') {
          url.searchParams.set(key, value ? 'true' : 'false');
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private get headers(): Record<string, string> {
    return {
      'X-Api-Key': this.apiKey,
      Accept: 'application/json',
    };
  }

  private async handleResponse<T>(
    response: Response,
    method: string,
    path: string,
  ): Promise<T> {
    console.error(`[sure-mcp] ${method} ${path} → ${response.status}`);

    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text().catch(() => '(no body)');
      }
      throw new SureApiError({
        status: response.status,
        endpoint: path,
        method,
        body,
      });
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string, query?: QueryParams): Promise<T> {
    const url = this.buildUrl(path, query);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    return this.handleResponse<T>(response, 'GET', path);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response, 'POST', path);
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response, 'PATCH', path);
  }

  async delete<T = void>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });
    return this.handleResponse<T>(response, 'DELETE', path);
  }
}

export function createClient(config: { baseUrl: string; apiKey: string }): SureClient {
  return new SureClient(config);
}
