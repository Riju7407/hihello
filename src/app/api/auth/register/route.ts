import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { crmRequest, CrmApiError } from "@/lib/crm-client";
import { setCustomerSessionCookies } from "@/lib/cookies";
import { AuthSessionData } from "@/types/crm";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(160),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(72, "Password must be at most 72 characters"),
  phone: z.string().min(1, "Phone is required").max(32),
  address: z.string().min(1, "Address is required").max(300),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  externalCustomerId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = registerSchema.safeParse(json);

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
      const data = await crmRequest<AuthSessionData>("/auth/register", {
        method: "POST",
        body: validated.data,
      });

      await setCustomerSessionCookies(data.token, data.account, data.expiresAt);

      return NextResponse.json(
        {
          success: true,
          data: {
            account: data.account,
            expiresAt: data.expiresAt,
          },
        },
        { status: 201 }
      );
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        // If CRM API key is missing or unauthorized, provide local simulation response
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          const generatedId = `shopper_${Date.now()}`;
          const dummyAccount = {
            customerId: `crm_${generatedId}`,
            externalCustomerId: validated.data.externalCustomerId || generatedId,
            email: validated.data.email.toLowerCase(),
            name: validated.data.name,
          };
          const dummyToken = `wc_demo_${Date.now()}_token`;
          const expiresAt = new Date(Date.now() + 8 * 3600 * 1000).toISOString();

          await setCustomerSessionCookies(dummyToken, dummyAccount, expiresAt);

          return NextResponse.json(
            {
              success: true,
              data: {
                account: dummyAccount,
                expiresAt,
              },
            },
            { status: 201 }
          );
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

