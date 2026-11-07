import { beforeEach, describe, expect, it } from "vitest";

import { enableVercelAnalytics, trackRouteChange } from "@/lib/analytics";

// Vercel's collector queues calls made before its script loads on window.vaq,
// so that queue is what proves a route change was reported.
describe("Vercel Web Analytics route tracking", () => {
  beforeEach(() => {
    delete window.va;
    delete window.vaq;
    enableVercelAnalytics();
  });

  it("reports one pageview per route change, with route and path", () => {
    trackRouteChange("/admin");

    expect(window.vaq).toEqual([["pageview", { route: "/admin", path: "/admin" }]]);
  });

  it("keeps the collector from tracking pushState on its own", () => {
    const script = document.querySelector("script[src*='script.debug.js']");

    expect(script?.getAttribute("data-disable-auto-track")).toBe("1");
  });
});
