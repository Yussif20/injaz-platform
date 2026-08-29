import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_API_URL, COOKIE_NAMES } from "@/config";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { setAuthCookies, clearAuthCookies } from "@/shared/lib/cookies";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const backendPath = path.join("/");
  const url = `${BACKEND_API_URL}/api/${backendPath}`;

  // Forward query params
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.AUTH_TOKEN)?.value;

  const incomingContentType = request.headers.get("content-type") ?? "";
  const isMultipart = incomingContentType.includes("multipart/form-data");

  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  // For multipart: do NOT set Content-Type — let Node.js fetch set it with the
  // correct boundary when we pass a FormData body below.
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Read body for non-GET requests
  let body: string | FormData | undefined;
  if (request.method !== "GET" && request.method !== "DELETE") {
    try {
      if (isMultipart) {
        // Re-create FormData so Node.js fetch can attach its own boundary
        const incoming = await request.formData();
        const outgoing = new FormData();
        for (const [key, value] of incoming.entries()) {
          outgoing.append(key, value);
        }
        body = outgoing;
      } else {
        body = await request.text();
      }
    } catch {
      // no body
    }
  }

  const makeRequest = async (authHeader?: string) => {
    const reqHeaders = { ...headers };
    if (authHeader) reqHeaders["Authorization"] = authHeader;

    const response = await fetch(fullUrl, {
      method: request.method,
      headers: reqHeaders,
      body,
    });
    return response;
  };

  let response = await makeRequest();

  // On 401, attempt token refresh then retry once
  if (response.status === 401) {
    const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
    if (refreshToken) {
      try {
        const { data: refreshData } = await serverApi.post(
          API_ENDPOINTS.AUTH.REFRESH,
          { refresh_token: refreshToken },
        );
        const { token: newToken, refresh_token: newRefresh } =
          refreshData.data;
        await setAuthCookies(newToken, newRefresh);

        // Retry with new token
        response = await makeRequest(`Bearer ${newToken}`);
      } catch {
        await clearAuthCookies();
        return NextResponse.json(
          { status: "Failure", message: "Session expired", data: null, errors: null },
          { status: 401 },
        );
      }
    } else {
      await clearAuthCookies();
      return NextResponse.json(
        { status: "Failure", message: "Not authenticated", data: null, errors: null },
        { status: 401 },
      );
    }
  }

  // Forward backend response as-is
  const responseData = await response.text();
  return new NextResponse(responseData, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
