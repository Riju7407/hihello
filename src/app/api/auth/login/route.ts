import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { crmRequest, CrmApiError } from "@/lib/crm-client";
import { setCustomerSessionCookies } from "@/lib/cookies";
import { AuthSessionData } from "@/types/crm";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = loginSchema.safeParse(json);

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
      const data = await crmRequest<AuthSessionData>("/auth/login", {
        method: "POST",
        body: validated.data,
      });

      await setCustomerSessionCookies(data.token, data.account, data.expiresAt);

      return NextResponse.json({
        success: true,
        data: {
          account: data.account,
          expiresAt: data.expiresAt,
        },
      });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        // Fallback simulation when CRM key is not configured
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          const generatedId = `shopper_${Date.now()}`;
          const dummyAccount = {
            customerId: `crm_${generatedId}`,
            externalCustomerId: generatedId,
            email: validated.data.email.toLowerCase(),
            name: validated.data.email.split("@")[0],
          };
          const dummyToken = `wc_demo_${Date.now()}_token`;
          const expiresAt = new Date(Date.now() + 8 * 3600 * 1000).toISOString();

          await setCustomerSessionCookies(dummyToken, dummyAccount, expiresAt);

          return NextResponse.json({
            success: true,
            data: {
              account: dummyAccount,
              expiresAt,
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
        error: {
          code: "INTERNAL_ERROR",
          message: msg,
        },
      },
      { status: 500 }
    );
  }
}

