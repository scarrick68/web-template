import type { DtaAuthHeaders } from "../api/auth";

// Browser-local persistence for Devise Token Auth credentials.
// This keeps token reads/writes out of page components.
export const TOKEN_STORAGE_KEYS = {
  accessToken: "access-token",
  client: "client",
  uid: "uid",
  expiry: "expiry",
  tokenType: "token-type",
} as const;

// Guard storage access for browser-only contexts.
function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// Persist the latest auth headers returned by sign-in/sign-up.
export function saveAuthTokens(tokens: DtaAuthHeaders) {
  if (!hasStorage()) return;

  localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, tokens.accessToken);
  localStorage.setItem(TOKEN_STORAGE_KEYS.client, tokens.client);
  localStorage.setItem(TOKEN_STORAGE_KEYS.uid, tokens.uid);

  if (tokens.expiry) {
    localStorage.setItem(TOKEN_STORAGE_KEYS.expiry, tokens.expiry);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.expiry);
  }

  if (tokens.tokenType) {
    localStorage.setItem(TOKEN_STORAGE_KEYS.tokenType, tokens.tokenType);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.tokenType);
  }
}

// Read auth headers from localStorage as a complete credential set.
export function getAuthTokens(): DtaAuthHeaders | null {
  if (!hasStorage()) return null;

  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken);
  const client = localStorage.getItem(TOKEN_STORAGE_KEYS.client);
  const uid = localStorage.getItem(TOKEN_STORAGE_KEYS.uid);

  if (!accessToken || !client || !uid) {
    return null;
  }

  const expiry = localStorage.getItem(TOKEN_STORAGE_KEYS.expiry) || undefined;
  const tokenType = localStorage.getItem(TOKEN_STORAGE_KEYS.tokenType) || undefined;

  return {
    accessToken,
    client,
    uid,
    expiry,
    tokenType,
  };
}

// Remove all persisted auth headers (used on sign-out or auth failure).
export function clearAuthTokens() {
  if (!hasStorage()) return;

  localStorage.removeItem(TOKEN_STORAGE_KEYS.accessToken);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.client);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.uid);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.expiry);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.tokenType);
}
