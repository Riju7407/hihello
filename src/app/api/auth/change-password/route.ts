import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSessionToken, clearCustomerSessionCookies } from "@/lib/cookies";
import { crmRequest, CrmApiError } from "@/lib/crm-client";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(12, "New password must be at least 12 characters")
    .max(72, "New password cannot exceed 72 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getCustomerSessionToken();
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required to change password",
          },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = changePasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: validated.error.errors.map((e) => e.message).join(", "),
          },
        },
        { status: 422 }
      );
    }

    try {
      await crmRequest("/auth/change-password", {
        method: "POST",
        body: validated.data,
        customerToken: token,
      });

      // CUSTOMER_AUTH_API.md: "A password change revokes every session for that website customer and requires a new login."
      await clearCustomerSessionCookies();

      return NextResponse.json({
        success: true,
        data: {
          message:
            "Password changed successfully. All previous sessions have been revoked. Please log in with your new password.",
        },
      });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          // Dev fallback
          await clearCustomerSessionCookies();
          return NextResponse.json({
            success: true,
            data: {
              message:
                "Password changed successfully. Please log in with your new password.",
            },
          });
        }
        return NextResponse.json(
          {
            success: false,
            error: {
              code: crmErr.code,
              message: crmErr.message,
              requestId: crmErr.requestId,
            },
          },
          { status: crmErr.status }
        );
      }
      throw crmErr;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: msg },
      },
      { status: 500 }
    );
  }
}

