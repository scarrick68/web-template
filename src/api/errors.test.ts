import { describe, expect, it } from "vitest";
import { normalizeApiErrorMessage } from "./errors";

describe("api/errors normalizeApiErrorMessage", () => {
  it("uses canonical api v1 error message when present", () => {
    const payload = {
      error: {
        type: "forbidden",
        message: "You are not authorized to perform this action",
        details: ["You are not authorized to perform this action"],
      },
    };

    expect(normalizeApiErrorMessage(payload, "fallback")).toBe("You are not authorized to perform this action");
  });

  it("falls back to canonical details when message is absent", () => {
    const payload = {
      error: {
        type: "unprocessable_entity",
        details: ["Email has already been taken", "Password is too short"],
      },
    };

    expect(normalizeApiErrorMessage(payload, "fallback")).toBe("Email has already been taken Password is too short");
  });

  it("uses top-level message fallback when error object is absent", () => {
    expect(normalizeApiErrorMessage({ message: "Request failed" }, "fallback")).toBe("Request failed");
  });

  it("returns fallback when payload has no usable messages", () => {
    expect(normalizeApiErrorMessage({}, "fallback")).toBe("fallback");
  });
});