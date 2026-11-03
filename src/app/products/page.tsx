import React from "react";
import Link from "next/link";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { getCategories, getProducts } from "@/lib/crm-client";
import ProductCard from "@/components/product/ProductCard";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "Products & Cattle Feeds | Holstein India",
  description:
    "Explore our complete range of high-yield cattle feeds, calf starters, bypass mineral supplements, and dairy nutrition solutions.",
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || undefined;
  const currentSearch = resolvedParams.search || undefined;
  const currentPage = parseInt(resolvedParams.page || "1", 10);

  const [categoriesData, productsData] = await Promise.all([
    getCategories(),
    getProducts({
      categoryId: currentCategory,
      search: currentSearch,
      page: currentPage,
      pageSize: 12,
    }),
  ]);

  const categories = categoriesData.items;
  const { items: products, total, pageSize } = productsData;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
            <Link href="/" className="hover:text-brand-forest">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium">Products</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Holstein Feed & Nutrition Catalogue
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl leading-relaxed">
            Science-formulated livestock nutrition manufactured from premium grains, bypass fats, and chelated minerals to maximize daily milk yield and herd longevity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-gray-100">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                !currentCategory
                  ? "bg-brand-forest text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Feeds ({total})
            </Link>
            {categories.map((cat) => {
              const isSelected = currentCategory === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-brand-forest text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Search Input Form */}
          <form method="GET" action="/products" className="relative shrink-0 max-w-xs w-full">
            {currentCategory && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch || ""}
              placeholder="Search feed, SKU..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-forest text-gray-800"
            />
          </form>
        </div>

        {/* Product Grid */}
        <div className="pt-8">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200/80">
              <SlidersHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                No products match the selected filters or search terms. Try searching for &quot;Xtra Milk&quot; or clearing your filter.
              </p>
              <div className="mt-5">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark rounded-lg transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                const isCurrent = currentPage === pageNumber;
                const params = new URLSearchParams();
                if (currentCategory) params.set("category", currentCategory);
                if (currentSearch) params.set("search", currentSearch);
                params.set("page", pageNumber.toString());

                return (
                  <Link
                    key={pageNumber}
                    href={`/products?${params.toString()}`}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                      isCurrent
                        ? "bg-brand-forest text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

