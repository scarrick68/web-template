import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildErrorReportPayload, reportError, sendErrorReport } from "./reporter";

describe("lib/errors reporter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    document.cookie = "ahoy_visitor=visitor-1;path=/";
    window.history.replaceState({}, "", "/me");
  });

  it("builds a sanitized payload with web metadata", () => {
    const payload = buildErrorReportPayload(new Error("boom"), {
      context: {
        feature: "billing",
        accessToken: "secret-token",
      },
    });

    expect(payload.client).toBe("web");
    expect(payload.origin).toBe("application");
    expect(payload.error.message).toBe("boom");
    expect(payload.context.metadata.route).toBe("/me");
    expect(payload.context.metadata.visitorId).toBe("visitor-1");
    expect(payload.context.explicit).toEqual({
      feature: "billing",
    });
    expect(JSON.stringify(payload)).not.toContain("secret-token");
  });

  it("sends payload to backend errors endpoint", async () => {
    const fetchMock = vi.mocked(fetch);

    await sendErrorReport({
      client: "web",
      origin: "application",
      handled: true,
      error: {
        name: "TypeError",
        message: "x is undefined",
      },
      context: {
        metadata: {
          appEnv: "test",
        },
        explicit: {},
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/errors"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("swallows transport failures for explicit reportError calls", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(reportError(new Error("boom"))).resolves.toBeUndefined();
  });

  it("sanitizes circular context values instead of throwing", () => {
    const circular: Record<string, unknown> = { feature: "billing" };
    circular.self = circular;

    expect(() => {
      buildErrorReportPayload("boom", {
        context: circular,
      });
    }).not.toThrow();

    const payload = buildErrorReportPayload("boom", {
      context: circular,
    });

    expect(payload.context.explicit).toEqual({
      feature: "billing",
      self: "[Circular]",
    });
  });

  it("omits blank ahoy visitor values from metadata", () => {
    document.cookie = "ahoy_visitor=;path=/";

    const payload = buildErrorReportPayload(new Error("boom"));

    expect(payload.context.metadata.visitorId).toBeUndefined();
  });

  it("sanitizes circular arrays instead of throwing", () => {
    const circular: unknown[] = [];
    circular.push(circular);

    expect(() => {
      buildErrorReportPayload("boom", {
        context: {
          samples: circular,
        },
      });
    }).not.toThrow();

    const payload = buildErrorReportPayload("boom", {
      context: {
        samples: circular,
      },
    });

    expect(payload.context.explicit).toEqual({
      samples: ["[Circular]"],
    });
  });
});
