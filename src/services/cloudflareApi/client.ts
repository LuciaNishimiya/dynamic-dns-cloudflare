import { config } from '../../config';
import { CloudflareResponse } from '../../types/cloudflare';

const BASE_URL = 'https://api.cloudflare.com/client/v4';

export async function cloudflareFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!config.cloudflare.apiKey) {
    throw new Error('Cloudflare API key is missing in configuration.');
  }

  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${config.cloudflare.apiKey}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = (await response.json()) as CloudflareResponse<unknown>;
      if (errJson.errors && errJson.errors.length > 0) {
        errorDetails += `: ${errJson.errors.map((e) => `[Code ${e.code}] ${e.message}`).join(', ')}`;
      }
    } catch {
      // Failed to parse json error body, use HTTP status
    }
    throw new Error(`Cloudflare API error at ${endpoint}: ${errorDetails}`);
  }

  const data = (await response.json()) as CloudflareResponse<T>;

  if (!data.success) {
    const errorMsgs = data.errors?.map((e) => `[Code ${e.code}] ${e.message}`).join(', ') || 'Unknown API error';
    throw new Error(`Cloudflare API request unsuccessful at ${endpoint}: ${errorMsgs}`);
  }

  return data.result;
}
