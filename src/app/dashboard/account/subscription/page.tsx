import { redirect } from "next/navigation";
import { ROUTES } from "@/config";

export default function SubscriptionPage() {
  redirect(ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION_MANAGE);
}
