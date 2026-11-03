"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { Product } from "@/types/crm";
import { useCartStore } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock =
    product.quantityOnHand !== undefined && product.quantityOnHand <= 0;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-4/3 w-full overflow-hidden bg-gray-50"
      >
        <Image
          src={
            product.imageUrls?.[0] ||
            "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80"
          }
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge: Tag or Stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.tag && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-forest text-white shadow-xs">
              {product.tag}
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-xs">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>SKU: {product.sku}</span>
            {product.packSizeLabel && (
              <span className="font-medium text-gray-500">
                {product.packSizeLabel}
              </span>
            )}
          </div>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-forest transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-normal">Selling Price</span>
            <span className="text-lg font-bold text-gray-900">
              {formatINR(product.sellingPrice)}
            </span>
            <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center p-2.5 rounded-lg text-sm font-medium transition-all ${
              added
                ? "bg-brand-primary text-white"
                : isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-brand-surface text-brand-forest hover:bg-brand-forest hover:text-white border border-brand-border"
            }`}
            title={added ? "Added to Cart" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
            aria-label="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

