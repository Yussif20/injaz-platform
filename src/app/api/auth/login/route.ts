import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { setAuthCookies } from "@/shared/lib/cookies";

// Standard backend error response
interface BackendErrorResponse {
  status: string;
  message: string;
  data: null;
  errors?: string[];
}

// ASP.NET Core validation error response
interface ValidationErrorResponse {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transform phoneNumber to phone for backend API
    const loginPayload = {
      phone: body.phoneNumber,
      password: body.password,
    };

    console.log("[Login] Attempting login to:", API_ENDPOINTS.AUTH.LOGIN);
    console.log("[Login] Payload:", { phone: loginPayload.phone, password: "***" });

    const { data } = await serverApi.post(API_ENDPOINTS.AUTH.LOGIN, loginPayload);

    console.log("[Login] Success:", data.status);

    // Backend returns: { status, message, data: { userId, phone, fullName, userName, role, token, refreshToken } }
    const { token, refreshToken, userId, phone, fullName, userName, role } =
      data.data;

    await setAuthCookies(token, refreshToken);

    // Return user info for the frontend
    return NextResponse.json({
      user: { userId, phone, fullName, userName, role },
    });
  } catch (error: unknown) {
    // Log the full error for debugging
    console.error("[Login] Error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: BackendErrorResponse | ValidationErrorResponse;
        };
        message?: string;
      };

      const status = axiosError.response?.status || 500;
      const backendData = axiosError.response?.data;

      console.error("[Login] Backend response:", backendData);

      // Handle ASP.NET Core validation errors format
      if (backendData && "title" in backendData && "errors" in backendData) {
        const validationData = backendData as ValidationErrorResponse;
        // Flatten validation errors into an array
        const errorMessages = Object.values(validationData.errors).flat();
        return NextResponse.json(
          {
            message: validationData.title,
            errors: errorMessages,
          },
          { status }
        );
      }

      // Handle standard backend error response
      const standardData = backendData as BackendErrorResponse;
      return NextResponse.json(
        {
          message: standardData?.message || "Login failed",
          errors: standardData?.errors || [],
        },
        { status }
      );
    }

    // Generic error
    return NextResponse.json(
      { message: "Login failed", errors: [] },
      { status: 500 }
    );
  }
}
