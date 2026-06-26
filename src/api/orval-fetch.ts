import { apiFetch, parseJsonResponse } from "./client";
import { getAuthTokens } from "../auth/tokenStore";

function shouldAttachAuth(url: string) {
  return url.startsWith("/api/");
}

export async function orvalFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    authHeaders: shouldAttachAuth(url) ? getAuthTokens() : null,
  });

  const payload = await parseJsonResponse<unknown>(response);

  return {
    status: response.status,
    data: payload,
    headers: response.headers,
  } as T;
}
