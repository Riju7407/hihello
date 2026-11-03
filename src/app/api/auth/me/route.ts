import { NextResponse } from "next/server";
import { getCustomerSessionToken, getCustomerAccountData, clearCustomerSessionCookies } from "@/lib/cookies";
import { crmRequest, CrmApiError } from "@/lib/crm-client";

export async function GET() {
  try {
    const token = await getCustomerSessionToken();
    const cachedAccount = await getCustomerAccountData();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Not logged in",
          },
        },
        { status: 401 }
      );
    }

    try {
      const data = await crmRequest<{
        account: {
          customerId: string;
          externalCustomerId: string;
          email: string;
          name: string;
        };
      }>("/auth/me", {
        method: "GET",
        customerToken: token,
      });

      return NextResponse.json({
        success: true,
        data: data.account,
      });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401) {
          // If token expired in CRM, clear cookie
          if (process.env.CRM_WEBSITE_API_KEY) {
            await clearCustomerSessionCookies();
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: "SESSION_EXPIRED",
                  message: "Your session has expired. Please log in again.",
                },
              },
              { status: 401 }
            );
          } else if (cachedAccount) {
            // Local dev mode with demo token
            return NextResponse.json({
              success: true,
              data: cachedAccount,
            });
          }
        }
      }
      if (cachedAccount) {
        return NextResponse.json({
          success: true,
          data: cachedAccount,
        });
      }
      throw crmErr;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error checking session";
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: msg },
      },
      { status: 500 }
    );
  }
}

