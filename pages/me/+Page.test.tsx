import { HttpResponse, http } from "msw";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOKEN_STORAGE_KEYS } from "../../src/auth/tokenStore";
import { server } from "../../test/support/msw-server";
import { renderWithQueryClient } from "../../test/support/render-with-query";
import Page from "./+Page";

describe("me page", () => {
  const mePathMatcher = "*/api/v1/users/me";

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("prompts user to sign in when auth tokens are missing", async () => {
    renderWithQueryClient(<Page />);

    expect(await screen.findByText("No stored auth session. Please sign in first.")).toBeInTheDocument();
  });

  it("loads current user with stored auth tokens", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, "token-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "client-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "user@example.com");

    let receivedHeaders: Record<string, string> | null = null;

    server.use(
      http.get(mePathMatcher, ({ request }) => {
        receivedHeaders = {
          accessToken: request.headers.get("access-token") || "",
          client: request.headers.get("client") || "",
          uid: request.headers.get("uid") || "",
        };

        return HttpResponse.json(
          {
            success: true,
            request_id: "req-1",
            meta: {},
            data: {
              id: 1,
              email: "user@example.com",
              name: null,
              admin: false,
              created_at: "2026-01-01T00:00:00Z",
              updated_at: "2026-01-01T00:00:00Z",
            },
          },
          { status: 200 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    await waitFor(() => {
      expect(screen.getByText("user@example.com")).toBeInTheDocument();
    });

    expect(receivedHeaders).toEqual({
      accessToken: "token-1",
      client: "client-1",
      uid: "user@example.com",
    });
  });

  it("clears stored auth tokens and shows error when /me returns auth failure", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, "token-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "client-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "user@example.com");

    server.use(
      http.get(mePathMatcher, () => {
        return HttpResponse.json(
          {
            success: false,
            errors: ["Unauthorized"],
          },
          { status: 401 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    expect(await screen.findByText("Unauthorized")).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.client)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.uid)).toBeNull();
  });

  it("shows canonical API v1 error message from error object", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, "token-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "client-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "user@example.com");

    server.use(
      http.get(mePathMatcher, () => {
        return HttpResponse.json(
          {
            success: false,
            request_id: "req-123",
            error: {
              type: "forbidden",
              message: "You are not authorized to perform this action",
              details: ["You are not authorized to perform this action"],
            },
          },
          { status: 403 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    expect(await screen.findByText("You are not authorized to perform this action")).toBeInTheDocument();
  });
});
