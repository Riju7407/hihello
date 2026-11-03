import React from "react";
import Link from "next/link";
import { ChevronRight, Search as SearchIcon } from "lucide-react";
import { getProducts } from "@/lib/crm-client";
import ProductCard from "@/components/product/ProductCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Search Products | Holstein India",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;
  const productsData = await getProducts({
    search: query || undefined,
    pageSize: 24,
  });

  const { items: products, total } = productsData;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Search</span>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            {query ? `Search results for "${query}"` : "Search Products & Feeds"}
          </h1>
          <form method="GET" action="/search" className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query || ""}
              placeholder="Search by feed name, SKU (e.g., Xtra Milk, Calf Starter)..."
              className="w-full pl-12 pr-28 py-3.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-forest text-gray-900 shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200/80">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">
              No matching products found
            </h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              We couldn&apos;t find any products matching &quot;{query}&quot;. Try checking for spelling errors or browsing all categories.
            </p>
            <div className="mt-5">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark rounded-lg transition-colors"
              >
                Browse All Feeds
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-500 mb-6">
              Found {total} {total === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

