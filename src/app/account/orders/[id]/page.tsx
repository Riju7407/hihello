"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ArrowLeft, Package, MapPin, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { Order } from "@/types/crm";
import { formatINR, formatDate } from "@/lib/utils";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id: externalOrderId } = use(params);

  const { data: order, isLoading, isError } = useQuery<Order>({
    queryKey: ["customer_order_detail", externalOrderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${externalOrderId}`);
      if (!res.ok) throw new Error("Order not found or access denied");
      const d = await res.json();
      return d.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-forest mx-auto mb-2" />
        <p className="text-xs text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center py-16 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          We could not locate this order or it is not associated with your current customer session.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center px-4 py-2 bg-brand-forest text-white text-xs font-semibold rounded-lg"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "PAID";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-forest hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center space-x-2">
            <span>Order</span>
            <span className="font-mono text-brand-forest">{order.externalOrderId}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Registered on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isPaid
                ? "bg-brand-surface text-brand-dark border border-brand-border"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isPaid ? "PAID" : "CASH DUE"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {order.status}
          </span>
        </div>
      </div>

      {/* Grid: Shipping Address Snapshot & Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs">
        {/* Shipping Snapshot */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-gray-900">
            <MapPin className="w-4 h-4 text-brand-forest" />
            <span>Immutable Shipping Address</span>
          </div>
          <p className="font-semibold text-gray-800">{order.shippingAddress.name}</p>
          <p className="text-gray-600">{order.shippingAddress.address}</p>
          <p className="text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
          </p>
          <p className="text-gray-500 font-mono">Contact: {order.shippingAddress.phone}</p>
        </div>

        {/* Payment Summary */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-gray-900">
            <CreditCard className="w-4 h-4 text-brand-forest" />
            <span>Payment Details</span>
          </div>
          <p className="text-gray-600">
            <strong>Method:</strong> {order.paymentMethod}
          </p>
          <p className="text-gray-600">
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          {order.notes && (
            <p className="text-gray-600 italic">
              <strong>Delivery Notes:</strong> &quot;{order.notes}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-center">Unit</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {item.productName || item.productId}
                    {item.sku && (
                      <span className="block text-2xs text-gray-400 font-normal">
                        SKU: {item.sku}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {item.unit || "Bag"}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatINR(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {formatINR(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50/80 border-t border-gray-200 font-bold">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-gray-700">
                  Authoritative Invoice Total:
                </td>
                <td className="px-4 py-3 text-right text-sm text-brand-forest font-black">
                  {formatINR(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

