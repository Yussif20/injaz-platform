import { redirect } from "next/navigation";
import { ROUTES } from "@/config";

export default function ProfileDataPage() {
  redirect(ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL);
}
