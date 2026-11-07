// Vercel Web Analytics wiring.
//
// The collector script is injected once, in the browser only, with its own
// pushState tracking disabled: TanStack Router updates the history entry before
// the new route has rendered, so the script's automatic pageview would carry a
// stale URL. Each navigation instead emits exactly one pageview through
// trackRouteChange, called from the root route with the router's location.

import { inject, pageview } from "@vercel/analytics";

export function enableVercelAnalytics() {
  inject({ framework: "react", disableAutoTrack: true });
}

export function trackRouteChange(pathname: string) {
  pageview({ route: pathname, path: pathname });
}
