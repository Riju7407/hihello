import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, Package, MapPin } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Order Confirmation | Holstein India",
};

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { id: externalOrderId } = await params;

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-brand-surface text-brand-forest flex items-center justify-center mx-auto border border-brand-border">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Order Placed Successfully!
            </h1>
            <p className="text-sm text-gray-500">
              Your order has been registered in Holstein CRM and is pending warehouse verification.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs flex justify-between items-center">
            <div>
              <span className="text-gray-500 block">External Order ID:</span>
              <span className="font-mono font-bold text-gray-900 text-sm">
                {externalOrderId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block">Date:</span>
              <span className="font-medium text-gray-800">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>

          {/* Status Breakdown according to WEBSITE_API.md */}
          <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-bold">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Status: Order Placed — Cash Collection Due</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              <strong>Important Policy Note:</strong> In accordance with Holstein CRM accounting protocols, cash orders are recorded with payment status <strong>PENDING (Cash Due)</strong>. Payment is only recorded as PAID after physical collection is verified by our authorized delivery agent.
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-4 text-xs text-gray-600 space-y-2">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-brand-forest shrink-0" />
              <span>Our logistics team will contact you to coordinate farm gate delivery.</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-forest shrink-0" />
              <span>Please keep the exact cash amount ready upon delivery vehicle arrival.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/account/orders"
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-colors"
            >
              <span>View Order History</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

