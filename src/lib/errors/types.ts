export type ReportableError = {
  name: string;
  message: string;
  stack?: string;
};

export type ErrorReportMetadata = {
  appEnv: string;
  route?: string;
  userAgent?: string;
  visitorId?: string;
};

export type ErrorReportPayload = {
  client: "web";
  origin: string;
  handled: boolean;
  error: ReportableError;
  context: {
    metadata: ErrorReportMetadata;
    explicit: Record<string, unknown>;
  };
};

export type ReportErrorOptions = {
  origin?: string;
  handled?: boolean;
  route?: string;
  context?: Record<string, unknown>;
};
