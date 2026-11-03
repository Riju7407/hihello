import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/crm-client";
import ProductCard from "@/components/product/ProductCard";

export default async function FeaturedProducts() {
  const { items: products } = await getProducts({ pageSize: 4 });

  return (
    <section className="py-16 sm:py-24 bg-gray-50/50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold tracking-widest text-brand-forest uppercase mb-2">
              Formulated for High Lactation
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Featured Products & Feeds
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-brand-forest hover:text-brand-dark group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

