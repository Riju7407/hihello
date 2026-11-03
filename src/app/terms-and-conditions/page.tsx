import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Holstein India",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Terms & Conditions</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Holstein Nutrition Private Limited (MMC Group Sister Concern)
        </p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing www.holstein.in or ordering feeds through our e-commerce portal, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Products & Pricing</h2>
            <p>
              All feeds, supplements, and dairy solutions are formulated for livestock consumption. Prices displayed on the website are in Indian Rupees (INR) and represent standard selling rates. Final authoritative invoice amounts are computed by Holstein CRM based on branch location, pack configurations, and statutory taxes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Orders & Payment Processing</h2>
            <p>
              Orders placed on the platform start as DRAFT orders in our CRM. Stock is checked upon submission and reserved upon warehouse confirmation. For Cash on Delivery (COD), payment remains due until certified collection by our authorized transport staff. For online payments, orders are marked PAID only upon cryptographic verification with the payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. User Account Obligations</h2>
            <p>
              You are responsible for maintaining the confidentiality of your customer account credentials. Account passwords must meet our minimum complexity requirement (12 characters). Five consecutive failed login attempts result in a temporary 15-minute security lockout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts located in Punjab, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

