import { describe, expect, it, vi } from "vitest";

const { reportErrorMock } = vi.hoisted(() => ({
  reportErrorMock: vi.fn(async () => undefined),
}));

vi.mock("./reporter", () => ({
  reportError: reportErrorMock,
}));

import { installGlobalErrorHandlers } from "./handlers";

describe("lib/errors handlers", () => {
  it("forwards window error events to reportError", async () => {
    const cleanup = installGlobalErrorHandlers();

    const event = new ErrorEvent("error", {
      message: "boom",
      filename: "app.tsx",
      lineno: 10,
      colno: 3,
      error: new Error("boom"),
    });

    window.dispatchEvent(event);
    await Promise.resolve();

    expect(reportErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        origin: "uncaught_exception",
        handled: false,
        context: expect.objectContaining({ filename: "app.tsx", lineno: 10, colno: 3 }),
      }),
    );

    cleanup();
  });

  it("forwards unhandled rejection events to reportError", async () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const cleanup = installGlobalErrorHandlers();

    // jsdom does not consistently expose PromiseRejectionEvent construction,
    // so invoke the installed listener shape directly.
    const rejectionListener = addEventListenerSpy.mock.calls.find(([name]) => name === "unhandledrejection")?.[1] as
      | ((event: { reason: unknown }) => void)
      | undefined;

    rejectionListener?.({ reason: "reject boom" });
    await Promise.resolve();

    expect(reportErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        origin: "unhandled_promise_rejection",
        handled: false,
        context: {
          reason: "reject boom",
        },
      }),
    );

    cleanup();
  });
});
