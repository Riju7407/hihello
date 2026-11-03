import { NextRequest, NextResponse } from "next/server";
import { getCustomerSessionToken, getCustomerAccountData } from "@/lib/cookies";
import { crmRequest, CrmApiError } from "@/lib/crm-client";
import { RazorpayCheckoutInitResponse } from "@/types/crm";
import { devOrderStore } from "@/lib/order-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: externalOrderId } = await params;
    const token = await getCustomerSessionToken();
    const account = await getCustomerAccountData();

    if (!token || !account) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Customer login required" },
        },
        { status: 401 }
      );
    }

    try {
      const data = await crmRequest<RazorpayCheckoutInitResponse>(
        `/orders/${encodeURIComponent(externalOrderId)}/checkout`,
        {
          method: "POST",
          body: { externalCustomerId: account.externalCustomerId },
          customerToken: token,
        }
      );
      return NextResponse.json({ success: true, data });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          const order = devOrderStore.get(externalOrderId);
          const amount = order?.totalAmountPaise || 150000;
          return NextResponse.json({
            success: true,
            data: {
              keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
              orderId: `order_dev_${Date.now()}`,
              amount,
              currency: "INR",
              paymentId: `pay_dev_${Date.now()}`,
              status: "READY",
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
    const msg = err instanceof Error ? err.message : "Error initiating checkout";
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

