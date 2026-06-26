import { HttpResponse, http } from "msw";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOKEN_STORAGE_KEYS } from "../../src/auth/tokenStore";
import { server } from "../../test/support/msw-server";
import { renderWithQueryClient } from "../../test/support/render-with-query";
import Page from "./+Page";

describe("signin page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("renders the sign-in form", () => {
    renderWithQueryClient(<Page />);

    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits credentials and stores auth tokens on success", async () => {
    const user = userEvent.setup();
    let requestBody: unknown = null;

    server.use(
      http.post("*/auth/sign_in", async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json(
          {
            data: {
              id: 1,
              uid: "user@example.com",
              provider: "email",
              email: "user@example.com",
              name: null,
              nickname: null,
              image: null,
              allow_password_change: null,
            },
          },
          {
            status: 200,
            headers: {
              "access-token": "token-1",
              client: "client-1",
              uid: "user@example.com",
              expiry: "1710000000",
              "token-type": "Bearer",
            },
          },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)).toBe("token-1");
    });

    expect(requestBody).toEqual({
      email: "user@example.com",
      password: "supersecret",
    });
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.client)).toBe("client-1");
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.uid)).toBe("user@example.com");
  });

  it("clears stored auth tokens and shows error when sign-in fails", async () => {
    const user = userEvent.setup();
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, "stale-token");
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "stale-client");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "stale@example.com");

    server.use(
      http.post("*/auth/sign_in", () => {
        return HttpResponse.json(
          {
            success: false,
            errors: ["Invalid login credentials"],
          },
          { status: 401 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText("Invalid login credentials")).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.client)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.uid)).toBeNull();
  });

  it("shows canonical API v1 error message when provided", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("*/auth/sign_in", () => {
        return HttpResponse.json(
          {
            success: false,
            request_id: "req-456",
            error: {
              type: "unauthorized",
              message: "Invalid login credentials. Please try again.",
              details: ["Invalid login credentials. Please try again."],
            },
          },
          { status: 401 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText("Invalid login credentials. Please try again.")).toBeInTheDocument();
  });
});
