import { HttpResponse, http } from "msw";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../test/support/msw-server";
import { renderWithQueryClient } from "../../test/support/render-with-query";
import Page from "./+Page";

describe("signup page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the signup form", () => {
    renderWithQueryClient(<Page />);

    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows a validation error when password confirmation does not match", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<Page />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "different");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Password confirmation does not match.")).toBeInTheDocument();
  });

  it("submits signup details to the registration endpoint", async () => {
    const user = userEvent.setup();
    let requestBody: unknown = null;

    server.use(
      http.post("*/auth", async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json(
          {
            status: "success",
            data: {
              id: 1,
              uid: "test@example.com",
              provider: "email",
              email: "test@example.com",
              name: null,
              nickname: null,
              image: null,
              allow_password_change: null,
            },
          },
          { status: 200 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(requestBody).not.toBeNull();
    });

    expect(requestBody).toMatchObject({
      email: "test@example.com",
      password: "supersecret",
      password_confirmation: "supersecret",
      confirm_success_url: "http://localhost:3000/",
    });
  });

  it("shows canonical API v1 error message when error object is returned", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("*/auth", () => {
        return HttpResponse.json(
          {
            success: false,
            request_id: "req-789",
            error: {
              type: "unprocessable_entity",
              message: "Email has already been taken",
              details: ["Email has already been taken"],
            },
          },
          { status: 422 },
        );
      }),
    );

    renderWithQueryClient(<Page />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Email has already been taken")).toBeInTheDocument();
  });
});
