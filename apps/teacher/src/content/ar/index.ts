/**
 * Arabic content barrel export
 */

export { commonContent } from "./common";
export { landingContent } from "./landing";
export { authContent } from "./auth";
export { dashboardContent } from "./dashboard";

// Combined content for backwards compatibility
import { commonContent } from "./common";
import { landingContent } from "./landing";
import { authContent } from "./auth";
import { dashboardContent } from "./dashboard";

export const content = {
  ...commonContent,
  ...landingContent,
  ...authContent,
  ...dashboardContent,
};
