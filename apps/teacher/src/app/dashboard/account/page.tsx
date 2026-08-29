import { redirect } from "next/navigation";
import { ROUTES } from "@/config";

export default function AccountPage() {
  redirect(ROUTES.DASHBOARD_ACCOUNT_INFO);
}
