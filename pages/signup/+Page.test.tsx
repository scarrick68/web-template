import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCreateUserRequestSchema } from "../../test/support/openapi";
import Page from "./+Page";

describe("signup page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads create-user request schema from api-template OpenAPI", () => {
    const schema = getCreateUserRequestSchema();

    expect(schema.required).toEqual(
      expect.arrayContaining(["email", "password", "password_confirmation"])
    );
  });

  it("shows a validation error when password confirmation does not match", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "different");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Password confirmation does not match.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits signup details with the expected payload", async () => {
    const createUserSchema = getCreateUserRequestSchema();
    const requiredFields = createUserSchema.required ?? [];
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = requestInit.headers as Headers;

    expect(fetchMock.mock.calls[0][0]).toBe("/auth");
    expect(requestInit.method).toBe("POST");
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("accept")).toBe("application/json");

    const body = JSON.parse(String(requestInit.body));

    expect(body).toMatchObject({
      email: "test@example.com",
      password: "supersecret",
      password_confirmation: "supersecret",
      confirm_success_url: "http://localhost:3000/",
    });

    for (const requiredField of requiredFields) {
      expect(body).toHaveProperty(requiredField);
    }

  });

  it("shows backend error messages when signup fails", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ["Email has already been taken"] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    await user.type(screen.getByLabelText(/email/i), "taken@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Email has already been taken")).toBeInTheDocument();
  });

  it("shows a network error message when the API is unreachable", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    render(<Page />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "supersecret");
    await user.type(screen.getByLabelText(/confirm password/i), "supersecret");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText("Unable to reach the API. Check VITE_API_BASE_URL and ensure Rails is running.")
    ).toBeInTheDocument();
  });
});
