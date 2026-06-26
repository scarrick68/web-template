import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiBaseLabel, apiFetch, apiUrl, getAhoyVisitorFromCookies, parseJsonResponse } from "./client";

describe("api/client helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    document.cookie = "ahoy_visitor=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });

  it("builds endpoint URLs from configured API base or relative paths", () => {
    const configuredApiBaseUrl =
      (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";

    expect(apiUrl("/auth")).toBe(
      configuredApiBaseUrl ? `${configuredApiBaseUrl}/auth` : "http://localhost:3000/auth",
    );
    expect(apiBaseLabel).toBe(configuredApiBaseUrl || "(Vite proxy -> http://localhost:5001)");
  });

  it("extracts ahoy visitor id from cookie strings", () => {
    expect(getAhoyVisitorFromCookies("foo=bar; ahoy_visitor=visitor-123; theme=dark")).toBe("visitor-123");
    expect(getAhoyVisitorFromCookies("foo=bar; theme=dark")).toBeUndefined();
  });

  it("sends JSON requests with default Accept and Content-Type headers", async () => {
    const fetchMock = vi.mocked(fetch);

    await apiFetch("/auth", {
      method: "POST",
      json: { email: "test@example.com" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = requestInit.headers as Headers;

    expect(url).toBe(apiUrl("/auth"));
    expect(requestInit.method).toBe("POST");
    expect(headers.get("accept")).toBe("application/json");
    expect(headers.get("content-type")).toBe("application/json");
    expect(requestInit.body).toBe('{"email":"test@example.com"}');
  });

  it("injects DTA auth headers and Ahoy-Visitor when provided", async () => {
    const fetchMock = vi.mocked(fetch);

    await apiFetch("/api/v1/users/me", {
      method: "GET",
      authHeaders: {
        accessToken: "token-1",
        client: "client-1",
        uid: "user@example.com",
        expiry: "1710000000",
        tokenType: "Bearer",
      },
      ahoyVisitor: "visitor-123",
    });

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = requestInit.headers as Headers;

    expect(headers.get("access-token")).toBe("token-1");
    expect(headers.get("client")).toBe("client-1");
    expect(headers.get("uid")).toBe("user@example.com");
    expect(headers.get("expiry")).toBe("1710000000");
    expect(headers.get("token-type")).toBe("Bearer");
    expect(headers.get("ahoy-visitor")).toBe("visitor-123");
  });

  it("uses ahoy_visitor cookie when ahoy override is not provided", async () => {
    const fetchMock = vi.mocked(fetch);
    document.cookie = "ahoy_visitor=cookie-visitor-1;path=/";

    await apiFetch("/api/v1/users/me", { method: "GET" });

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = requestInit.headers as Headers;

    expect(headers.get("ahoy-visitor")).toBe("cookie-visitor-1");
  });

  it("parses JSON responses and falls back to empty object when parsing fails", async () => {
    const parsed = await parseJsonResponse<{ ok: boolean }>({
      json: async () => ({ ok: true }),
    } as unknown as Response);

    const fallback = await parseJsonResponse<Record<string, unknown>>({
      json: async () => {
        throw new Error("invalid json");
      },
    } as unknown as Response);

    expect(parsed).toEqual({ ok: true });
    expect(fallback).toEqual({});
  });
});
