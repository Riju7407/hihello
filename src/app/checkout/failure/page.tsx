import React from "react";
import Link from "next/link";
import { XCircle, RefreshCw, PhoneCall } from "lucide-react";

interface FailurePageProps {
  searchParams: Promise<{ orderId?: string; reason?: string }>;
}

export const metadata = {
  title: "Payment Unsuccessful | Holstein India",
};

export default async function CheckoutFailurePage({
  searchParams,
}: FailurePageProps) {
  const { orderId, reason } = await searchParams;

  return (
    <div className="bg-gray-50/50 min-h-screen py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <XCircle className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Payment Incomplete
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              The payment could not be captured or verified by the payment gateway. Your card or account was not charged.
            </p>
          </div>

          {reason && (
            <div className="bg-red-50/80 p-4 rounded-xl border border-red-200 text-xs text-red-700 text-left font-mono">
              <strong>Provider response:</strong> {reason}
            </div>
          )}

          {orderId && (
            <p className="text-xs text-gray-400">
              Order Reference: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-500 text-left space-y-2">
            <p className="font-semibold text-gray-700">Next Steps:</p>
            <p>• You can safely retry checkout using the same order reference.</p>
            <p>• Check your UPI app or netbanking connection.</p>
            <p>• Alternatively, you can choose Cash on Delivery (COD) for your order.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/checkout"
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Checkout</span>
            </Link>
            <a
              href="tel:18002965555"
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-brand-forest" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

