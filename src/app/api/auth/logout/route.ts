import { NextResponse } from "next/server";
import { getCustomerSessionToken, clearCustomerSessionCookies } from "@/lib/cookies";
import { crmRequest } from "@/lib/crm-client";

export async function POST() {
  try {
    const token = await getCustomerSessionToken();

    if (token) {
      try {
        await crmRequest("/auth/logout", {
          method: "POST",
          customerToken: token,
        });
      } catch (err) {
        // Even if CRM logout fails or token is already revoked, always clear local cookies
        console.warn("[CRM] Logout CRM call error:", err);
      }
    }

    await clearCustomerSessionCookies();

    return NextResponse.json({
      success: true,
      data: { message: "Successfully logged out" },
    });
  } catch (err: unknown) {
    await clearCustomerSessionCookies();
    return NextResponse.json({
      success: true,
      data: { message: "Logged out" },
    });
  }
}

