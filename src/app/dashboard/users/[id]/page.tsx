"use client";

import { useParams } from "next/navigation";
import { UserDetailPage } from "@/features/users/components/UserDetailPage";

export default function UserDetailRoute() {
  const params = useParams();
  const userId = parseInt(params.id as string, 10);

  if (isNaN(userId)) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-grey-500">معرف العميل غير صالح</p>
      </div>
    );
  }

  return <UserDetailPage userId={userId} />;
}
