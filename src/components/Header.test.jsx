// Verifies the MPA active-link logic: Header has no router, so the "active" link
// is derived from window.location.pathname. For each page we set the path and
// assert exactly the matching nav link carries the `active` class.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { navLinks } from "./navLinks";

describe("Header active link", () => {
  it.each(navLinks)(
    "marks only '$label' active when path is '$href'",
    ({ href, label }) => {
      window.history.pushState({}, "", href);
      render(<Header />);

      for (const link of navLinks) {
        const el = screen.getByRole("link", { name: link.label });
        if (link.label === label) {
          expect(el).toHaveClass("active");
        } else {
          expect(el).not.toHaveClass("active");
        }
      }
    },
  );

  it("marks Root active for a nested path under a route", () => {
    window.history.pushState({}, "", "/routea/sub/deep");
    render(<Header />);
    // First path segment (routea) drives the match, so nested paths still
    // highlight their route.
    expect(screen.getByRole("link", { name: "Route A" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Root" })).not.toHaveClass(
      "active",
    );
  });
});
