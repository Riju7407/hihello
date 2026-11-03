import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/crm-client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const categories = await getCategories(search);
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching categories";
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_ERROR", message: msg },
      },
      { status: 500 }
    );
  }
}

