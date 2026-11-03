"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/crm";
import { useCartStore } from "@/store/cart-store";

interface ActionsProps {
  product: Product;
  isOutOfStock: boolean;
}

export default function ProductDetailActions({ product, isOutOfStock }: ActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const maxStock = product.quantityOnHand ?? 999999;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="pt-4 space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Quantity:
        </span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            disabled={isOutOfStock || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:bg-gray-100 disabled:opacity-40 transition-colors text-gray-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            disabled={isOutOfStock || quantity >= maxStock}
            onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
            className="p-2 hover:bg-gray-100 disabled:opacity-40 transition-colors text-gray-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            added
              ? "bg-brand-primary text-white"
              : isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-brand-forest hover:bg-brand-dark text-white"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

