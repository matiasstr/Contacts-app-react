type RequestBody = BodyInit | Record<string, unknown> | unknown[] | null | undefined;

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let tokenGetter: () => string | null = () => null;

export function getApiUrl() {
  return apiUrl.replace(/\/$/, '');
}

export function setApiTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

export async function apiClient<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: RequestBody } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = tokenGetter();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body as BodyInit | null | undefined;
  if (options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
    body,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok || (payload && typeof payload === 'object' && 'status' in payload && Number((payload as any).status) >= 400)) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as any).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
