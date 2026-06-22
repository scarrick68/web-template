import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOKEN_STORAGE_KEYS } from "../../src/auth/tokenStore";
import Page from "./+Page";

// Minimal smoke tests for authenticated /me scaffold page.

describe("me page", () => {
  // Reset browser auth state and mock state between runs.
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("prompts user to sign in when auth tokens are missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    expect(await screen.findByText("No stored auth session. Please sign in first.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads current user with stored auth tokens", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, "token-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "client-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "user@example.com");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({
        data: {
          id: 1,
          email: "user@example.com",
          name: null,
          admin: false,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = requestInit.headers as Headers;

    expect(url).toBe("/api/v1/users/me");
    expect(requestInit.method).toBe("GET");
    expect(headers.get("access-token")).toBe("token-1");
    expect(headers.get("client")).toBe("client-1");
    expect(headers.get("uid")).toBe("user@example.com");

    expect(await screen.findByText("user@example.com")).toBeInTheDocument();
  });

  it("clears stored auth tokens and shows error when /me returns auth failure", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, "token-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "client-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "user@example.com");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      headers: new Headers(),
      json: async () => ({ errors: ["Unauthorized"] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    expect(await screen.findByText("Unauthorized")).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.client)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.uid)).toBeNull();
  });
});
