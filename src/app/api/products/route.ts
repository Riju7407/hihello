import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/crm-client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const products = await getProducts({
      page,
      pageSize,
      search,
      categoryId,
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching products";
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_ERROR", message: msg },
      },
      { status: 500 }
    );
  }
}

