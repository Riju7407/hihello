import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 sm:px-6 py-20">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-brand-border text-brand-forest flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-forest">
            404 — Page Not Found
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            The page or product you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-brand-forest hover:bg-brand-dark text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-brand-forest" />
            <span>Browse Feeds</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

