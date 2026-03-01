import { redirect } from "next/navigation";
import { ROUTES } from "@/config";

/**
 * Terms & conditions moved to a standalone page with landing layout.
 * Redirect old /sign/terms-conditions links to /terms.
 */
export default function SignTermsConditionsRedirect() {
  redirect(ROUTES.TERMS);
}
