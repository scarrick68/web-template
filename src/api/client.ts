// This module wraps fetch with project defaults (base URL, JSON handling,
// DTA auth headers, and Ahoy analytics header forwarding).

import { applyDtaAuthHeaders, type DtaAuthHeaders } from "./auth";

const configuredApiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:5001";

export const apiBaseLabel = configuredApiBaseUrl;

export type ApiRequestOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: HeadersInit;
  body?: BodyInit | null;
  json?: unknown;
  authHeaders?: DtaAuthHeaders | null;
  ahoyVisitor?: string | null;
};

// Build endpoint URLs from the explicit API base URL.
export function apiUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${configuredApiBaseUrl}${path}`;
}

// Pull ahoy_visitor from cookie text so it can be forwarded as Ahoy-Visitor.
export function getAhoyVisitorFromCookies(cookieString: string) {
  return cookieString
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith("ahoy_visitor="))
    ?.slice("ahoy_visitor=".length);
}

// Prefer explicit override when provided (tests/server-side hooks), otherwise
// read from document.cookie in the browser.
function resolveAhoyVisitor(overrideValue?: string | null) {
  if (overrideValue !== undefined) {
    return overrideValue;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return getAhoyVisitorFromCookies(document.cookie) || null;
}

// Only methods with request bodies should get auto JSON Content-Type.
function hasJsonBody(method: string | undefined) {
  const resolvedMethod = method?.toUpperCase();
  return resolvedMethod !== "GET" && resolvedMethod !== "HEAD";
}

// Shared request entrypoint for the app. It sets JSON defaults, injects auth
// headers, forwards Ahoy visitor identity, and then delegates to fetch.
export async function apiFetch(path: string, options: ApiRequestOptions = {}) {
  const { json, headers, authHeaders, ahoyVisitor, body: rawBody, ...requestInit } = options;
  const resolvedHeaders = new Headers(headers);
  const resolvedRequestInit: RequestInit = { ...requestInit };

  // React Query query functions pass `signal`. In jsdom test runs this can be
  // rejected by fetch before MSW can intercept, so skip signal wiring in tests.
  if (import.meta.env.MODE === "test" && resolvedRequestInit.signal) {
    delete resolvedRequestInit.signal;
  }

  if (!resolvedHeaders.has("Accept")) {
    resolvedHeaders.set("Accept", "application/json");
  }

  if (json !== undefined && hasJsonBody(requestInit.method) && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  applyDtaAuthHeaders(resolvedHeaders, authHeaders);

  const resolvedAhoyVisitor = resolveAhoyVisitor(ahoyVisitor);
  if (resolvedAhoyVisitor) {
    resolvedHeaders.set("Ahoy-Visitor", resolvedAhoyVisitor);
  }

  return fetch(apiUrl(path), {
    ...resolvedRequestInit,
    headers: resolvedHeaders,
    body: json !== undefined ? JSON.stringify(json) : rawBody,
  });
}

// Parse JSON safely for API responses; fall back to empty object for endpoints
// that return no JSON body.
export async function parseJsonResponse<T>(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as T;
  return payload;
}
