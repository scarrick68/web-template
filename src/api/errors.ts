export type ApiErrorObject = {
  type?: string;
  message?: string;
  details?: unknown;
};

export type ApiErrorPayload = {
  error?: ApiErrorObject | null;
  message?: string | null;
  errors?: unknown;
};

function normalizeDetails(details: unknown) {
  if (Array.isArray(details)) {
    return details
      .map((entry) => String(entry).trim())
      .filter((entry) => entry.length > 0);
  }

  if (details && typeof details === "object") {
    return Object.values(details as Record<string, unknown>)
      .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
      .map((entry) => String(entry).trim())
      .filter((entry) => entry.length > 0);
  }

  if (typeof details === "string" && details.trim().length > 0) {
    return [details.trim()];
  }

  return [];
}

export function normalizeApiErrorMessage(payload: ApiErrorPayload, fallbackMessage: string) {
  if (payload.error && typeof payload.error === "object") {
    const message = payload.error.message?.trim();
    if (message) {
      return message;
    }

    const details = normalizeDetails(payload.error.details);
    if (details.length > 0) {
      return details.join(" ");
    }
  }

  if (typeof payload.message === "string" && payload.message.trim().length > 0) {
    return payload.message.trim();
  }

  const errors = normalizeDetails(payload.errors);
  if (errors.length > 0) {
    return errors.join(" ");
  }

  return fallbackMessage;
}