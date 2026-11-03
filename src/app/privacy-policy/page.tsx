import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Holstein India",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Last Updated: November 2026 • Holstein Nutrition Private Limited (MMC Group)
        </p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
            <p>
              Holstein Nutrition Private Limited (&quot;Holstein India&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), a sister concern of the MMC Group (Mahajan Molasses Company), respects your privacy and is committed to protecting the personal data of our customers, farmers, distributors, and website visitors. This Privacy Policy outlines how we collect, process, store, and safeguard your data when using our website (www.holstein.in) and CRM-integrated e-commerce services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <p>We collect information necessary to fulfill orders and provide agricultural support:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
              <li><strong>Customer Identity & Contact Information:</strong> Name, farm representation, phone number, email address, farm delivery address, city, state, and postal code.</li>
              <li><strong>Order & Transaction Records:</strong> External order references, purchased cattle feeds, line quantities, delivery snapshots, and CRM invoice records.</li>
              <li><strong>Payment Data:</strong> We do not store credit card numbers or banking passwords. Online transactions are processed securely via Razorpay in compliance with RBI guidelines.</li>
              <li><strong>Authentication Data:</strong> Secure bcrypt password hashes stored in our CRM authentication ledger. Plaintext passwords are never stored or logged.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>Your information is used strictly for legitimate commercial purposes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
              <li>Processing, billing, dispatching, and delivering cattle feed orders.</li>
              <li>Generating authorized GST tax invoices and dispatch documentation.</li>
              <li>Providing customer support and responding to feed ration queries.</li>
              <li>Maintaining authenticated customer accounts and fraud prevention.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Security & Storage</h2>
            <p>
              All communication with our CRM servers utilizes industry-standard TLS encryption. Customer sessions are maintained using secure HttpOnly cookies protected against cross-site scripting (XSS). Access to CRM records is strictly limited to authorized personnel under role-based access control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact Information</h2>
            <p>
              For questions concerning this Privacy Policy or data requests, contact our Compliance Officer at:
            </p>
            <p className="text-xs font-semibold text-gray-800 mt-2">
              Holstein Nutrition Private Limited<br />
              1803, 18th Floor, Omaxe India Trade Tower, New Chandigarh, Punjab – 140901<br />
              Email: info@holstein.in | Toll-Free: 1800-296-5555
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

