import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./support/msw-server";

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
	vi.unstubAllGlobals();
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
