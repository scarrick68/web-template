import { reportError } from "./reporter";

function toErrorFromUnknown(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  return new Error(typeof value === "string" ? value : "Unknown exception");
}

export function installGlobalErrorHandlers() {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onError = (event: ErrorEvent) => {
    const sourceError = event.error instanceof Error ? event.error : new Error(event.message || "Unhandled error");

    void reportError(sourceError, {
      origin: "uncaught_exception",
      handled: false,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    void reportError(toErrorFromUnknown(event.reason), {
      origin: "unhandled_promise_rejection",
      handled: false,
    });
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}
