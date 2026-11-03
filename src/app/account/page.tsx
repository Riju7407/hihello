"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, MapPin, User, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { Order, PaginatedList } from "@/types/crm";
import { formatINR, formatDate } from "@/lib/utils";

export default function AccountOverviewPage() {
  const { customer } = useCustomer();

  const { data: ordersData, isLoading: ordersLoading } = useQuery<PaginatedList<Order>>({
    queryKey: ["customer_orders", customer?.externalCustomerId],
    queryFn: async () => {
      const res = await fetch("/api/orders?pageSize=3");
      if (!res.ok) return { items: [], total: 0, page: 1, pageSize: 3 };
      const d = await res.json();
      return d.success ? d.data : { items: [], total: 0, page: 1, pageSize: 3 };
    },
    enabled: Boolean(customer?.externalCustomerId),
  });

  const orders = ordersData?.items || [];
  const totalOrders = ordersData?.total || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, {customer?.name}!
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Manage your farm orders, update delivery destinations, and review past feed dispatches.
        </p>

        {/* 3 Metric Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block font-medium">Total Orders Placed</span>
            <span className="text-2xl font-black text-brand-forest mt-1 block">
              {totalOrders}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block font-medium">Customer Reference</span>
            <span className="text-xs font-mono font-bold text-gray-800 mt-2 block truncate">
              {customer?.externalCustomerId}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block font-medium">Account Status</span>
            <div className="mt-1.5 flex items-center space-x-1.5 text-xs font-semibold text-brand-forest">
              <ShieldCheck className="w-4 h-4 text-brand-forest" />
              <span>Verified CRM Shopper</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-brand-forest" />
            <h2 className="text-lg font-bold text-gray-900">Recent Feed Orders</h2>
          </div>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-brand-forest hover:underline inline-flex items-center space-x-1"
          >
            <span>View All ({totalOrders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {ordersLoading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-400">
            <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p>You haven&apos;t placed any orders yet.</p>
            <Link
              href="/products"
              className="mt-3 inline-block px-4 py-2 bg-brand-forest text-white font-semibold rounded-lg text-xs"
            >
              Explore Feed Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.externalOrderId}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      {order.externalOrderId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-2xs ${
                        order.paymentStatus === "PAID"
                          ? "bg-brand-surface text-brand-dark border border-brand-border"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus === "PAID" ? "PAID" : "CASH DUE"}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">
                    Placed on {formatDate(order.createdAt)} • {order.items.length} items
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <span className="font-bold text-gray-900 text-sm">
                    {formatINR(order.totalAmount)}
                  </span>
                  <Link
                    href={`/account/orders/${order.externalOrderId}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

