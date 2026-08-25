import { describe, expect, it } from "vitest";
import {
  APP_MARKER,
  HEAD_MARKER,
  collectAssetUrls,
  injectApp,
  prerenderHtml,
  renderHeadTags,
  replaceTitle,
  validateMeta,
} from "./prerenderHtml.js";

const html = `<!doctype html>
<html lang="en">
  <head>
    <title>Placeholder</title>
    ${HEAD_MARKER}
  </head>
  <body>
    <div id="root">${APP_MARKER}</div>
  </body>
</html>
`;

const meta = { title: "Route A", description: "An example page." };

describe("injectApp", () => {
  it("replaces the marker with the rendered markup", () => {
    expect(injectApp(html, "<h1>Hi</h1>")).toContain(
      '<div id="root"><h1>Hi</h1></div>',
    );
  });

  it("throws when the marker is missing", () => {
    expect(() => injectApp('<div id="root"></div>', "<h1>Hi</h1>")).toThrow(
      /missing <!--app-html--> marker/,
    );
  });
});

describe("replaceTitle", () => {
  it("swaps in the page title", () => {
    expect(replaceTitle(html, "Route A")).toContain("<title>Route A</title>");
  });

  it("escapes the title", () => {
    expect(replaceTitle(html, 'a & b <c> "d"')).toContain(
      "<title>a &amp; b &lt;c&gt; &quot;d&quot;</title>",
    );
  });

  it("throws when there is no title element", () => {
    expect(() => replaceTitle("<html></html>", "x")).toThrow(/<title>/);
  });
});

describe("renderHeadTags", () => {
  it("emits description and og tags", () => {
    const tags = renderHeadTags(meta, "/routea/");
    expect(tags).toContain(
      '<meta name="description" content="An example page." />',
    );
    expect(tags).toContain('<meta property="og:title" content="Route A" />');
    expect(tags).toContain('<meta property="og:type" content="website" />');
    expect(tags).toContain('<meta name="twitter:card" content="summary" />');
  });

  it("omits og:url when no siteUrl is configured", () => {
    expect(renderHeadTags(meta, "/routea/")).not.toContain("og:url");
  });

  it("makes og:url and og:image absolute against siteUrl", () => {
    const tags = renderHeadTags(
      { ...meta, siteUrl: "https://example.com", image: "/card.png" },
      "/routea/",
    );
    expect(tags).toContain(
      '<meta property="og:url" content="https://example.com/routea/" />',
    );
    expect(tags).toContain(
      '<meta property="og:image" content="https://example.com/card.png" />',
    );
    expect(tags).toContain(
      '<meta name="twitter:card" content="summary_large_image" />',
    );
  });

  it("escapes quotes so injected values cannot break out of an attribute", () => {
    const tags = renderHeadTags(
      { ...meta, description: '" onload="alert(1)' },
      "/",
    );
    expect(tags).toContain(
      '<meta name="description" content="&quot; onload=&quot;alert(1)" />',
    );
  });
});

describe("prerenderHtml", () => {
  it("applies every transform and consumes both markers", () => {
    const out = prerenderHtml(html, "<h1>Hi</h1>", meta, "/routea/");
    expect(out).not.toContain(APP_MARKER);
    expect(out).not.toContain(HEAD_MARKER);
    expect(out).toContain("<title>Route A</title>");
    expect(out).toContain('<div id="root"><h1>Hi</h1></div>');
  });

  it("still renders when the head marker is absent", () => {
    const out = prerenderHtml(
      html.replace(HEAD_MARKER, ""),
      "<h1>Hi</h1>",
      meta,
      "/",
    );
    expect(out).toContain("<title>Route A</title>");
  });
});

describe("validateMeta", () => {
  it("accepts a complete meta object", () => {
    expect(validateMeta(meta)).toBeNull();
  });

  it.each([
    [undefined, /export const meta/],
    [{ title: "Route A" }, /meta\.description/],
    [{ ...meta, title: "   " }, /meta\.title/],
  ])("rejects %o", (value, message) => {
    expect(validateMeta(value)).toMatch(message);
  });
});

describe("collectAssetUrls", () => {
  it("finds deduplicated /assets/ urls in src and href", () => {
    expect(
      collectAssetUrls(
        '<link href="/assets/a-1.svg"/><img src="/assets/a-1.svg"/><img src="/assets/b-2.png"/><img src="/vite.svg"/>',
      ),
    ).toEqual(["/assets/a-1.svg", "/assets/b-2.png"]);
  });
});
