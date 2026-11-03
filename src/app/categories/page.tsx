import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, Layers } from "lucide-react";
import { getCategories } from "@/lib/crm-client";

export const metadata = {
  title: "Product Categories | Holstein India",
  description:
    "Browse Holstein dairy feed categories: dairy cattle feed, calf growth, transition wellness, and nutritional supplements.",
};

export default async function CategoriesPage() {
  const { items: categories } = await getCategories();

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Categories</span>
        </div>

        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Feed Categories & Formulations
          </h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Targeted nutrition programs tailored for every physiological stage of ruminant livestock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-brand-forest/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center mb-4 border border-brand-border group-hover:bg-brand-forest group-hover:text-white transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-forest transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {cat.description || "Scientifically balanced feeds formulated by Holstein Nutrition."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-forest">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

