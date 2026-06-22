import { describe, expect, it } from "vitest";
import { applyDtaAuthHeaders, extractDtaAuthHeaders } from "./auth";

describe("api/auth helpers", () => {
  it("extracts DTA headers when required values exist", () => {
    const headers = new Headers({
      "access-token": "token-1",
      client: "client-1",
      uid: "user@example.com",
      expiry: "1710000000",
      "token-type": "Bearer",
    });

    const result = extractDtaAuthHeaders({ headers });

    expect(result).toEqual({
      accessToken: "token-1",
      client: "client-1",
      uid: "user@example.com",
      expiry: "1710000000",
      tokenType: "Bearer",
    });
  });

  it("returns null when required DTA headers are missing", () => {
    const headers = new Headers({
      client: "client-1",
      uid: "user@example.com",
    });

    expect(extractDtaAuthHeaders({ headers })).toBeNull();
  });

  it("applies DTA auth headers to outgoing request headers", () => {
    const headers = new Headers();
    const result = applyDtaAuthHeaders(headers, {
      accessToken: "token-1",
      client: "client-1",
      uid: "user@example.com",
      expiry: "1710000000",
      tokenType: "Bearer",
    });

    expect(result).toBe(headers);
    expect(headers.get("access-token")).toBe("token-1");
    expect(headers.get("client")).toBe("client-1");
    expect(headers.get("uid")).toBe("user@example.com");
    expect(headers.get("expiry")).toBe("1710000000");
    expect(headers.get("token-type")).toBe("Bearer");
  });

  it("leaves headers unchanged when auth payload is missing", () => {
    const headers = new Headers({ Accept: "application/json" });

    const result = applyDtaAuthHeaders(headers, null);

    expect(result).toBe(headers);
    expect(headers.get("accept")).toBe("application/json");
    expect(headers.get("access-token")).toBeNull();
  });
});
