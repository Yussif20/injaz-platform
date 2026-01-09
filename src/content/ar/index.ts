/**
 * Arabic content barrel export
 */

export { commonContent } from "./common";
export { landingContent } from "./landing";
export { authContent } from "./auth";

// Combined content for backwards compatibility
import { commonContent } from "./common";
import { landingContent } from "./landing";
import { authContent } from "./auth";

export const content = {
  ...commonContent,
  ...landingContent,
  ...authContent,
};
