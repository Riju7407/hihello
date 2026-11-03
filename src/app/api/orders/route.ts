import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSessionToken, getCustomerAccountData } from "@/lib/cookies";
import { crmRequest, CrmApiError, OFFICIAL_HOLSTEIN_PRODUCTS } from "@/lib/crm-client";
import { devOrderStore } from "@/lib/order-store";
import { CreateOrderPayload, Order, PaginatedList } from "@/types/crm";

const shippingAddressSchema = z.object({
  name: z.string().min(1).max(160),
  phone: z.string().min(1).max(32),
  address: z.string().min(1).max(300),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.literal("IN"),
});

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive().max(999999),
});

const createOrderSchema = z.object({
  externalOrderId: z.string().min(1).max(100),
  paymentMethod: z.enum(["RAZORPAY", "CASH"]),
  shippingAddress: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1).max(100),
  notes: z.string().max(3000).optional(),
});

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const validated = createOrderSchema.safeParse(body);

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

    // Merge duplicate product lines if any
    const mergedItemsMap = new Map<string, number>();
    for (const item of validated.data.items) {
      mergedItemsMap.set(
        item.productId,
        (mergedItemsMap.get(item.productId) || 0) + item.quantity
      );
    }
    const cleanItems = Array.from(mergedItemsMap.entries()).map(
      ([productId, quantity]) => ({ productId, quantity })
    );

    const payload: CreateOrderPayload = {
      externalOrderId: validated.data.externalOrderId,
      externalCustomerId: account.externalCustomerId,
      paymentMethod: validated.data.paymentMethod,
      shippingAddress: validated.data.shippingAddress,
      items: cleanItems,
      notes: validated.data.notes,
    };

    try {
      const order = await crmRequest<Order>("/orders", {
        method: "POST",
        body: payload,
        customerToken: token,
      });

      return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          // Dev fallback simulation
          let total = 0;
          const populatedItems = cleanItems.map((item) => {
            const prod = OFFICIAL_HOLSTEIN_PRODUCTS.find(
              (p) => p.id === item.productId
            );
            const price = parseFloat(prod?.sellingPrice || "1000");
            const lineTotal = price * item.quantity;
            total += lineTotal;
            return {
              productId: item.productId,
              productName: prod?.name || "Holstein Product",
              sku: prod?.sku || "HL-PROD",
              unit: prod?.unit || "Unit",
              quantity: item.quantity,
              unitPrice: price.toFixed(2),
              totalPrice: lineTotal.toFixed(2),
            };
          });

          const createdOrder: Order = {
            id: `ord_${Date.now()}`,
            externalOrderId: payload.externalOrderId,
            externalCustomerId: account.externalCustomerId,
            status: "DRAFT",
            paymentStatus: "PENDING",
            paymentMethod: payload.paymentMethod,
            currency: "INR",
            totalAmount: total.toFixed(2),
            totalAmountPaise: Math.round(total * 100),
            shippingAddress: payload.shippingAddress,
            items: populatedItems,
            notes: payload.notes,
            createdAt: new Date().toISOString(),
          };

          devOrderStore.set(payload.externalOrderId, createdOrder);

          return NextResponse.json(
            { success: true, data: createdOrder },
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
    const msg = err instanceof Error ? err.message : "Error creating order";
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

    try {
      const orders = await crmRequest<PaginatedList<Order>>(
        `/orders?externalCustomerId=${encodeURIComponent(
          account.externalCustomerId
        )}&page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          customerToken: token,
        }
      );
      return NextResponse.json({ success: true, data: orders });
    } catch (crmErr) {
      if (crmErr instanceof CrmApiError) {
        if (crmErr.status === 401 && !process.env.CRM_WEBSITE_API_KEY) {
          const userOrders = Array.from(devOrderStore.values()).filter(
            (o) => o.externalCustomerId === account.externalCustomerId
          );
          return NextResponse.json({
            success: true,
            data: {
              items: userOrders,
              total: userOrders.length,
              page,
              pageSize,
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
    const msg = err instanceof Error ? err.message : "Error listing orders";
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

