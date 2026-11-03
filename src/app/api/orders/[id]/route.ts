import { NextRequest, NextResponse } from "next/server";
import { getCustomerSessionToken, getCustomerAccountData } from "@/lib/cookies";
import { crmRequest, CrmApiError } from "@/lib/crm-client";
import { Order } from "@/types/crm";
import { devOrderStore } from "@/lib/order-store";

export async function GET(
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
      const order = await crmRequest<Order>(
        `/orders/${encodeURIComponent(externalOrderId)}?externalCustomerId=${encodeURIComponent(
          account.externalCustomerId
        )}`,
        {
          method: "GET",
          customerToken: token,
        }
      );
      return NextResponse.json({ success: true, data: order });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          const found = devOrderStore.get(externalOrderId);
          if (found && found.externalCustomerId === account.externalCustomerId) {
            return NextResponse.json({ success: true, data: found });
          }
          return NextResponse.json(
            {
              success: false,
              error: { code: "NOT_FOUND", message: "Order not found" },
            },
            { status: 404 }
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
    const msg = err instanceof Error ? err.message : "Error fetching order";
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

