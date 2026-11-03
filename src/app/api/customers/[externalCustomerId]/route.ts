import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSessionToken, getCustomerAccountData } from "@/lib/cookies";
import { crmRequest, CrmApiError } from "@/lib/crm-client";
import { CustomerProfile } from "@/types/crm";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(160).optional(),
  phone: z.string().min(1).max(32).optional(),
  address: z.string().min(1).max(300).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  postalCode: z.string().min(1).max(20).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ externalCustomerId: string }> }
) {
  try {
    const { externalCustomerId } = await params;
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

    // Security guard: Ensure customer can only access their own profile
    if (account.externalCustomerId !== externalCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Cannot access profile of another customer",
          },
        },
        { status: 403 }
      );
    }

    try {
      const data = await crmRequest<CustomerProfile>(
        `/customers/${encodeURIComponent(externalCustomerId)}`,
        {
          method: "GET",
          customerToken: token,
        }
      );
      return NextResponse.json({ success: true, data });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          // Dev fallback
          return NextResponse.json({
            success: true,
            data: {
              customerId: account.customerId,
              externalCustomerId: account.externalCustomerId,
              name: account.name,
              email: account.email,
              phone: "9876543210",
              address: "1803, Omaxe India Trade Tower",
              city: "New Chandigarh",
              state: "Punjab",
              postalCode: "140901",
              country: "IN",
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
    const msg = err instanceof Error ? err.message : "Error retrieving profile";
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ externalCustomerId: string }> }
) {
  try {
    const { externalCustomerId } = await params;
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

    if (account.externalCustomerId !== externalCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Cannot modify profile of another customer",
          },
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);

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
      const data = await crmRequest<CustomerProfile>(
        `/customers/${encodeURIComponent(externalCustomerId)}`,
        {
          method: "PATCH",
          body: validated.data,
          customerToken: token,
        }
      );
      return NextResponse.json({ success: true, data });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          return NextResponse.json({
            success: true,
            data: {
              externalCustomerId,
              ...validated.data,
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
    const msg = err instanceof Error ? err.message : "Error updating profile";
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

