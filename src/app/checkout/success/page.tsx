import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, PackageCheck, FileText } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export const metadata = {
  title: "Payment Successful | Holstein India",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="bg-gray-50/50 min-h-screen py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-surface text-brand-forest flex items-center justify-center mx-auto border border-brand-border">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Payment & Order Verified!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for ordering with Holstein Nutrition. Your payment has been securely confirmed by Holstein CRM.
            </p>
          </div>

          {orderId && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
              <span className="text-gray-500 block">External Order Reference:</span>
              <span className="font-mono font-bold text-gray-800 text-sm">{orderId}</span>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-2 border-t border-b border-gray-100 py-4 text-left">
            <div className="flex items-center space-x-2">
              <PackageCheck className="w-4 h-4 text-brand-forest shrink-0" />
              <span>Order has been placed and forwarded to the branch warehouse.</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-forest shrink-0" />
              <span>Tax invoice will be generated upon dispatch verification.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/account/orders"
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-colors"
            >
              <span>View Order in Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

