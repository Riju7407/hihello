import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from "lucide-react";
import { getProductById, getProducts } from "@/lib/crm-client";
import { formatINR } from "@/lib/utils";
import ProductDetailActions from "./ProductDetailActions";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found | Holstein" };
  return {
    title: `${product.name} | Holstein India`,
    description: product.description || `Buy ${product.name} directly from Holstein Nutrition.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const isOutOfStock =
    product.quantityOnHand !== undefined && product.quantityOnHand <= 0;

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link href="/products" className="hover:text-brand-forest">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
              <Image
                src={
                  product.imageUrls?.[0] ||
                  "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1000&q=80"
                }
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-brand-forest text-white shadow-sm">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Purchasing */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span className="text-brand-forest font-medium">{product.categoryName || "Cattle Nutrition"}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-3xl font-black text-gray-900">
                  {formatINR(product.sellingPrice)}
                </span>
                <span className="text-sm text-gray-500">
                  per {product.unit} ({product.packSizeLabel || "Standard Pack"})
                </span>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? "bg-rose-500" : "bg-brand-primary animate-pulse"
                  }`}
                />
                <span className={isOutOfStock ? "text-rose-600" : "text-brand-forest"}>
                  {isOutOfStock
                    ? "Currently Out of Stock"
                    : `In Stock (${product.quantityOnHand ?? 100} units available at branch)`}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Client Component for Quantity & Add to Cart */}
              <ProductDetailActions product={product} isOutOfStock={isOutOfStock} />

              {/* Assurance Trust Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-4 h-4 text-brand-forest shrink-0" />
                  <span>Prompt Dispatch & Tracking</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
                  <span>100% Guaranteed Purity</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <RotateCcw className="w-4 h-4 text-brand-forest shrink-0" />
                  <span>Moisture-Proof Packaging</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                  <span>ISI & Lab Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional Composition Table */}
        {product.productDetails && Object.keys(product.productDetails).length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Guaranteed Nutritional Analysis
            </h2>
            <div className="max-w-2xl bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(product.productDetails).map(([key, val]) => (
                    <tr key={key} className="hover:bg-gray-100/50">
                      <td className="px-6 py-3.5 font-semibold text-gray-700 w-1/2">
                        {key}
                      </td>
                      <td className="px-6 py-3.5 text-gray-900 font-mono">
                        {String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

