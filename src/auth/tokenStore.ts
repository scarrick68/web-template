import type { DtaAuthHeaders } from "../api/auth";

// Browser-local persistence for Devise Token Auth credentials.
// This keeps token reads/writes out of page components.
export const AUTH_STORAGE_KEY = "web-template.auth.devise-token";
export const AUTH_STORAGE_VERSION = 1;

type StoredAuthTokens = {
  version: typeof AUTH_STORAGE_VERSION;
  tokens: DtaAuthHeaders;
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function normalizeAuthTokens(tokens: DtaAuthHeaders): DtaAuthHeaders {
  return {
    accessToken: tokens.accessToken || undefined,
    client: tokens.client || undefined,
    uid: tokens.uid || undefined,
    expiry: tokens.expiry || undefined,
    tokenType: tokens.tokenType || undefined,
    authorization: tokens.authorization || undefined,
  };
}

function hasValidCredentials(tokens: DtaAuthHeaders) {
  const hasDtaTriplet = Boolean(tokens.accessToken && tokens.client && tokens.uid);
  return hasDtaTriplet || Boolean(tokens.authorization);
}

// Persist the latest auth headers returned by sign-in/sign-up.
export function saveAuthTokens(tokens: DtaAuthHeaders) {
  const storage = getStorage();
  if (!storage) return;

  const normalizedTokens = normalizeAuthTokens(tokens);

  if (!hasValidCredentials(normalizedTokens)) {
    storage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  const storedTokens: StoredAuthTokens = {
    version: AUTH_STORAGE_VERSION,
    tokens: normalizedTokens,
  };

  try {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedTokens));
  } catch {
    // Storage can fail in restricted contexts; auth can continue in memory.
  }
}

// Read auth headers from localStorage as a complete credential set.
export function getAuthTokens(): DtaAuthHeaders | null {
  const storage = getStorage();
  if (!storage) return null;

  let rawValue: string | null;

  try {
    rawValue = storage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!rawValue) return null;

  try {
    const storedTokens = JSON.parse(rawValue) as Partial<StoredAuthTokens>;

    if (storedTokens.version !== AUTH_STORAGE_VERSION || !storedTokens.tokens) {
      storage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    const tokens = normalizeAuthTokens(storedTokens.tokens);

    if (!hasValidCredentials(tokens)) {
      storage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return tokens;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

// Remove all persisted auth headers (used on sign-out or auth failure).
export function clearAuthTokens() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Best-effort cleanup.
  }
}
