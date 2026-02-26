/**
 * POST /api/subscriptions/apple-pay-session
 * Merchant validation proxy for Apple Pay Web.
 * Called during onvalidatemerchant event — forwards validation URL to Moyasar.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { validationURL } = await request.json();
  const moyasarKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;
  const host = request.headers.get("host") ?? "";

  const res = await fetch("https://api.moyasar.com/v1/applepay/initiate", {
    method: "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      validation_url: validationURL,
      display_name: "إنجاز المعلم",
      domain_name: host.split(":")[0],
      publishable_api_key: moyasarKey,
    }),
  });

  const session = await res.json();
  return NextResponse.json(session, { status: res.status });
}
