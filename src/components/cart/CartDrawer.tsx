"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getEstimatedSubtotal } =
    useCartStore();

  if (!isOpen) return null;

  const subtotal = getEstimatedSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        {/* Cart Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-brand-forest" />
            <h2 className="text-lg font-semibold text-gray-900">Your Shopping Cart</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-surface text-brand-forest border border-brand-border">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-brand-forest mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                Explore our high-performance dairy cattle feeds and nutritional supplements.
              </p>
              <button
                onClick={closeCart}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-forest hover:bg-brand-dark rounded-lg transition-colors"
              >
                Browse Feeds
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const linePrice = (parseFloat(product.sellingPrice) || 0) * quantity;
              return (
                <div key={product.id} className="py-4 flex space-x-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <Image
                      src={
                        product.imageUrls?.[0] ||
                        "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/products/${product.id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-gray-900 hover:text-brand-forest line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.packSizeLabel || product.unit} • {formatINR(product.sellingPrice)}
                      </p>
                    </div>

                    {/* Quantity Selector & Line Total */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-gray-800">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-gray-900">
                        {formatINR(linePrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="text-gray-600 font-medium">Estimated Total</span>
              <span className="font-bold text-gray-900 text-lg">
                {formatINR(subtotal)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              * Authoritative invoice total and delivery terms are calculated directly by Holstein CRM.
            </p>
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-medium bg-brand-forest hover:bg-brand-dark transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full block text-center py-2 text-xs font-semibold text-gray-600 hover:text-brand-forest"
              >
                View Full Cart Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

