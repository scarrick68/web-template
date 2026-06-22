import { beforeEach, describe, expect, it } from "vitest";
import { clearAuthTokens, getAuthTokens, saveAuthTokens, TOKEN_STORAGE_KEYS } from "./tokenStore";

// Behavioral tests for browser auth token persistence helpers.

describe("auth/tokenStore", () => {
  // Ensure each test starts with empty browser storage.
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and reads DTA auth tokens", () => {
    saveAuthTokens({
      accessToken: "token-1",
      client: "client-1",
      uid: "user@example.com",
      expiry: "1710000000",
      tokenType: "Bearer",
    });

    expect(getAuthTokens()).toEqual({
      accessToken: "token-1",
      client: "client-1",
      uid: "user@example.com",
      expiry: "1710000000",
      tokenType: "Bearer",
    });
  });

  it("returns null when required tokens are not present", () => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.client, "client-1");
    localStorage.setItem(TOKEN_STORAGE_KEYS.uid, "user@example.com");

    expect(getAuthTokens()).toBeNull();
  });

  it("clears all stored auth values", () => {
    saveAuthTokens({
      accessToken: "token-1",
      client: "client-1",
      uid: "user@example.com",
      expiry: "1710000000",
      tokenType: "Bearer",
    });

    clearAuthTokens();

    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.client)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.uid)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.expiry)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEYS.tokenType)).toBeNull();
  });
});
