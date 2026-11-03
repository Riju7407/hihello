import React from "react";
import Link from "next/link";
import { AlertCircle, Phone, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Password Assistance | Holstein India",
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Password Assistance
            </h1>
            <p className="text-xs text-gray-500">
              Information regarding Holstein Customer Account Access
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2 leading-relaxed">
            <p className="font-semibold text-amber-950">
              Notice Regarding Customer Password Resets:
            </p>
            <p>
              In accordance with Holstein CRM backend security specifications (<code>CUSTOMER_AUTH_API.md</code>), automated self-service email password-reset delivery is not currently enabled for website customer accounts.
            </p>
            <p>
              If your account is locked due to consecutive incorrect attempts, the system automatically unlocks it after 15 minutes.
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-4 space-y-3 text-xs text-gray-600">
            <p className="font-semibold text-gray-800">
              Need immediate assistance with your account?
            </p>
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4 text-brand-forest shrink-0" />
              <span>Toll-Free Helpline: <strong>1800-296-5555</strong> (9 AM – 6 PM)</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Mail className="w-4 h-4 text-brand-forest shrink-0" />
              <span>Email: <strong>support@holstein.in</strong></span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-forest hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

