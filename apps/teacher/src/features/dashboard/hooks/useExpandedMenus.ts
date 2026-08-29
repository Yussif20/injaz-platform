/**
 * Expanded-menu state for the sidebars.
 *
 * The set of open menus has two inputs: the current route (a menu containing the active
 * page opens automatically) and the user's own clicks (which may open or close anything).
 * Both sidebars need exactly this, and both previously derived it in a `useEffect` that
 * called `setState` synchronously — one render to paint the old menus, an effect, then a
 * second render to correct them, on every navigation.
 *
 * Instead the route-derived value is recomputed during render and compared against the
 * route it was last computed for. That is React's documented way to adjust state when an
 * input changes: React restarts the render before committing, so nothing is painted twice
 * and no effect is involved.
 */

import { useState } from "react";
import { ROUTES } from "@/config";

/** Menus whose section contains `pathname`, and which should therefore start open. */
export function menusForPath(pathname: string): string[] {
  const expandable = [
    ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION,
    ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA,
  ];
  return expandable.filter((route) => pathname.startsWith(route));
}

export interface ExpandedMenus {
  isExpanded: (href: string) => boolean;
  toggle: (href: string) => void;
}

export function useExpandedMenus(pathname: string): ExpandedMenus {
  const [expanded, setExpanded] = useState<string[]>(() => menusForPath(pathname));
  const [lastPathname, setLastPathname] = useState(pathname);

  // Navigating re-derives the open menus, discarding manual toggles from the previous
  // page. Setting state during render is intentional here and is not a cascading render:
  // React discards the in-progress output and re-runs this component immediately.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setExpanded(menusForPath(pathname));
  }

  return {
    isExpanded: (href) => expanded.includes(href),
    toggle: (href) =>
      setExpanded((prev) =>
        prev.includes(href) ? prev.filter((m) => m !== href) : [...prev, href]
      ),
  };
}
