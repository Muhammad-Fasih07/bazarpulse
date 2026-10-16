import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const DEFAULT_USER_AGENT =
  process.env.SCRAPER_USER_AGENT ||
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (compatible; BazaarPulse/1.0; +https://bazaarpulse.com/bot)';

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface FetchOptions extends AxiosRequestConfig {
  retries?: number;
  retryDelayMs?: number;
  rateLimitDelayMs?: number;
}

/**
 * Robust HTTP client with automatic exponential backoff, rate limiting, and timeouts
 */
export async function safeFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<AxiosResponse<T>> {
  const {
    retries = 3,
    retryDelayMs = 1500,
    rateLimitDelayMs = 300,
    headers = {},
    timeout = 15000,
    ...rest
  } = options;

  let attempt = 0;
  let lastError: any = null;

  while (attempt <= retries) {
    try {
      if (rateLimitDelayMs > 0) {
        await sleep(rateLimitDelayMs + Math.random() * 200);
      }

      const response = await axios.get<T>(url, {
        timeout,
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          ...headers,
        },
        ...rest,
      });

      return response;
    } catch (err: any) {
      lastError = err;
      attempt++;

      const status = err?.response?.status;
      // Do not retry on permanent client errors like 404 Not Found or 410 Gone
      if (status === 404 || status === 410) {
        throw err;
      }

      if (attempt <= retries) {
        const backoffMs = retryDelayMs * Math.pow(2, attempt - 1);
        console.warn(
          `[HttpClient] Warning: Fetching ${url} failed (${err?.message || status}). Retrying in ${backoffMs}ms (attempt ${attempt}/${retries})...`
        );
        await sleep(backoffMs);
      }
    }
  }

  throw lastError;
}
