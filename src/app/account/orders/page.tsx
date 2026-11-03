"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { Order, PaginatedList } from "@/types/crm";
import { formatINR, formatDate } from "@/lib/utils";

export default function OrdersHistoryPage() {
  const { customer } = useCustomer();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<PaginatedList<Order>>({
    queryKey: ["customer_orders_history", customer?.externalCustomerId, page],
    queryFn: async () => {
      const res = await fetch(`/api/orders?page=${page}&pageSize=10`);
      if (!res.ok) throw new Error("Failed to load orders");
      const d = await res.json();
      return d.data;
    },
    enabled: Boolean(customer?.externalCustomerId),
  });

  const orders = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (data?.pageSize || 10));

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
      <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track cattle feed shipments, payment status, and review order receipts.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-surface text-brand-forest border border-brand-border">
          {total} {total === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-forest mx-auto mb-2" />
          <p className="text-xs text-gray-500">Retrieving orders from CRM...</p>
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-xs text-red-600 bg-red-50 rounded-xl p-4">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p>Failed to retrieve orders. Please refresh or try again later.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200/80">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            You have not placed any feed or cattle nutrition orders yet.
          </p>
          <div className="mt-5">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark rounded-lg transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPaid = order.paymentStatus === "PAID";
            return (
              <div
                key={order.externalOrderId}
                className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-gray-900 text-sm">
                        {order.externalOrderId}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold ${
                          isPaid
                            ? "bg-brand-surface text-brand-dark border border-brand-border"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isPaid ? "PAID" : "CASH DUE"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-gray-100 text-gray-700">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-2xs text-gray-400 mt-1">
                      Ordered on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <span className="text-base font-bold text-gray-900">
                      {formatINR(order.totalAmount)}
                    </span>
                    <Link
                      href={`/account/orders/${order.externalOrderId}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="text-xs text-gray-600 space-y-1">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate pr-4">
                        {item.quantity}x {item.productName || item.productId}
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatINR(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-2xs text-gray-400 italic">
                      + {order.items.length - 2} more item(s)...
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

