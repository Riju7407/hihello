"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getEstimatedSubtotal } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getEstimatedSubtotal();

  if (!mounted) {
    return (
      <div className="bg-white min-h-[60vh] py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-forest mb-2" />
        <p className="text-sm text-gray-500">Loading your shopping cart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
        </h1>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-200/80 max-w-2xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Looks like you haven&apos;t added any feeds or nutrition products yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-colors shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Table/Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {items.map(({ product, quantity }) => {
                  const lineTotal = (parseFloat(product.sellingPrice) || 0) * quantity;
                  return (
                    <div
                      key={product.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Image & Info */}
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
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
                        <div>
                          <Link
                            href={`/products/${product.id}`}
                            className="text-base font-semibold text-gray-900 hover:text-brand-forest line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            SKU: {product.sku} • {product.packSizeLabel || product.unit}
                          </p>
                          <p className="text-sm font-bold text-gray-800 mt-1">
                            {formatINR(product.sellingPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="text-base font-bold text-gray-900 min-w-[90px] text-right">
                          {formatINR(lineTotal)}
                        </span>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear Entire Cart
                </button>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-brand-forest hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-5 sticky top-28">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

                <div className="space-y-3 text-sm border-b border-gray-200 pb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Cart Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Direct Farm Delivery</span>
                    <span className="text-brand-forest font-medium">Standard Logistics</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST & Taxes</span>
                    <span className="text-gray-500">Calculated by CRM</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Authoritative Subtotal</span>
                  <span className="text-xl text-brand-forest">{formatINR(subtotal)}</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Final order totals, applicable branch taxes, and stock reservations are computed by Holstein CRM upon checkout submission.
                </p>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

