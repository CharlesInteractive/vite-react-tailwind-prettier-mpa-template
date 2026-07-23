// Global test setup: register jest-dom matchers (toHaveClass, toBeInTheDocument,
// …) and unmount rendered components between tests so each test starts clean.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
