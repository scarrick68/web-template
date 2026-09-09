import { apiFetch, getAhoyVisitorFromCookies } from "../../api/client";
import type { ErrorReportMetadata, ErrorReportPayload, ReportErrorOptions, ReportableError } from "./types";

const SENSITIVE_KEY_PATTERN = /token|authorization|password|secret|cookie|session|credential/i;

function appEnv() {
  return (import.meta.env.MODE || "development").toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function truncateString(value: string, maxLength = 2_000) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}...[truncated]`;
}

function sanitizeValue(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
  if (typeof value === "string") {
    return truncateString(value);
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);
    return value.slice(0, 20).map((entry) => sanitizeValue(entry, seen));
  }

  if (isRecord(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);
    const result: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        continue;
      }

      result[key] = sanitizeValue(entry, seen);
    }

    return result;
  }

  return String(value);
}

function toReportableError(error: unknown): ReportableError {
  if (error instanceof Error) {
    return {
      name: error.name || "Error",
      message: truncateString(error.message || "Unknown error"),
      stack: error.stack ? truncateString(error.stack, 8_000) : undefined,
    };
  }

  if (typeof error === "string") {
    return {
      name: "Error",
      message: truncateString(error),
    };
  }

  return {
    name: "UnknownError",
    message: truncateString(JSON.stringify(sanitizeValue(error))),
  };
}

function buildMetadata(options: ReportErrorOptions): ErrorReportMetadata {
  const visitorId = typeof document === "undefined" ? undefined : getAhoyVisitorFromCookies(document.cookie)?.trim() || undefined;

  return {
    appEnv: appEnv(),
    route: options.route || (typeof window !== "undefined" ? window.location.pathname : undefined),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    visitorId,
  };
}

export function buildErrorReportPayload(error: unknown, options: ReportErrorOptions = {}): ErrorReportPayload {
  const normalizedError = toReportableError(error);

  return {
    client: "web",
    origin: options.origin || "application",
    handled: options.handled ?? true,
    error: normalizedError,
    context: {
      metadata: buildMetadata(options),
      explicit: (sanitizeValue(options.context || {}) as Record<string, unknown>) || {},
    },
  };
}

export async function sendErrorReport(payload: ErrorReportPayload) {
  await apiFetch("/api/v1/errors", {
    method: "POST",
    json: payload,
  });
}

export async function reportError(error: unknown, options: ReportErrorOptions = {}) {
  try {
    const payload = buildErrorReportPayload(error, options);
    await sendErrorReport(payload);
  } catch {
    // Error reporting must never trigger another application failure.
  }
}
