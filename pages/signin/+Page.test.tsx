import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOKEN_STORAGE_KEYS } from "../../src/auth/tokenStore";
import Page from "./+Page";

// Integration-style tests for the sign-in page request and token behavior.

describe("signin page", () => {
  // Reset mocks and browser state between sign-in scenarios.
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("renders the sign-in form", () => {
    render(<Page />);

    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits credentials and stores auth tokens on success", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({
        "access-token": "token-1",
        client: "client-1",
        uid: "user@example.com",
        expiry: "1710000000",
        "token-type": "Bearer",
      }),
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = requestInit.headers as Headers;

    expect(fetchMock.mock.calls[0][0]).toBe("/auth/sign_in");
    expect(requestInit.method).toBe("POST");
    expect(headers.get("accept")).toBe("application/json");
    expect(headers.get("content-type")).toBe("application/json");
    expect(JSON.parse(String(requestInit.body))).toEqual({
      email: "user@example.com",
      password: "supersecret",
    });

    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)).toBe("token-1");
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.client)).toBe("client-1");
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.uid)).toBe("user@example.com");
  });
});
