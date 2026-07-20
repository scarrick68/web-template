import { beforeEach, describe, expect, it } from "vitest";
import { AUTH_STORAGE_KEY, AUTH_STORAGE_VERSION, clearAuthTokens, getAuthTokens, saveAuthTokens } from "./tokenStore";

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
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        version: AUTH_STORAGE_VERSION,
        tokens: {
          client: "client-1",
          uid: "user@example.com",
        },
      }),
    );

    expect(getAuthTokens()).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("saves and reads Authorization-only auth tokens", () => {
    saveAuthTokens({
      authorization: "Bearer jwt-token-1",
    });

    expect(getAuthTokens()).toEqual({
      accessToken: undefined,
      client: undefined,
      uid: undefined,
      expiry: undefined,
      tokenType: undefined,
      authorization: "Bearer jwt-token-1",
    });
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

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("drops stored values when version is unsupported", () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        version: 999,
        tokens: {
          accessToken: "token-1",
          client: "client-1",
          uid: "user@example.com",
        },
      }),
    );

    expect(getAuthTokens()).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("drops malformed stored JSON", () => {
    localStorage.setItem(AUTH_STORAGE_KEY, "not-json");

    expect(getAuthTokens()).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
