// Devise Token Auth (DTA) expects auth credentials to move between responses and
// requests via these headers. This file centralizes that mapping.

export const DTA_AUTH_HEADER_NAMES = [
  "access-token",
  "client",
  "uid",
  "expiry",
  "token-type",
] as const;

export type DtaAuthHeaders = {
  accessToken: string;
  client: string;
  uid: string;
  expiry?: string;
  tokenType?: string;
};

// Read DTA auth headers from a response after sign-in/sign-up. Returns null when
// required headers are missing so callers can treat the response as unauthenticated.
export function extractDtaAuthHeaders(response: Pick<Response, "headers">): DtaAuthHeaders | null {
  const accessToken = response.headers.get("access-token");
  const client = response.headers.get("client");
  const uid = response.headers.get("uid");

  if (!accessToken || !client || !uid) {
    return null;
  }

  return {
    accessToken,
    client,
    uid,
    expiry: response.headers.get("expiry") || undefined,
    tokenType: response.headers.get("token-type") || undefined,
  };
}

// Apply DTA auth headers to an outgoing request so protected endpoints can
// resolve the current user.
export function applyDtaAuthHeaders(headers: Headers, authHeaders?: DtaAuthHeaders | null) {
  if (!authHeaders) {
    return headers;
  }

  headers.set("access-token", authHeaders.accessToken);
  headers.set("client", authHeaders.client);
  headers.set("uid", authHeaders.uid);

  if (authHeaders.expiry) {
    headers.set("expiry", authHeaders.expiry);
  }

  if (authHeaders.tokenType) {
    headers.set("token-type", authHeaders.tokenType);
  }

  return headers;
}
