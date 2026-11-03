import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/crm-client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PRODUCT_NOT_FOUND",
            message: `Product with ID '${id}' not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching product";
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_ERROR", message: msg },
      },
      { status: 500 }
    );
  }
}

