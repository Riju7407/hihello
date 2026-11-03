import React from "react";
import Link from "next/link";
import { ChevronRight, RotateCcw, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | Holstein India",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Return & Refund Policy</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Return & Refund Policy
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Quality Assurance, Damaged Shipment Replacement, and Refund Terms
        </p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Quality Guarantee</h2>
            <p>
              At Holstein Nutrition, animal welfare and feed quality are our paramount commitments. Every batch of our dairy cattle feeds and nutritional supplements undergoes laboratory testing for crude protein, moisture, aflatoxin thresholds, and mineral composition.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Eligibility for Returns & Replacements</h2>
            <p>
              Due to strict biosafety and animal health standards, feeds cannot be returned once bags have been opened, tampered with, or exposed to farm contaminants. However, you are eligible for an immediate replacement or full refund under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
              <li>Bags received in damaged, punctured, or moisture-affected condition during transit.</li>
              <li>Incorrect SKU or product formulation delivered compared to your confirmed CRM order.</li>
              <li>Visible manufacturing defects or seal discrepancies noted at the time of truck unloading.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Reporting Window & Procedure</h2>
            <p>
              Any damaged or discrepant bags must be reported to our helpline within <strong>48 hours of delivery</strong>. Please provide photographic evidence of the damaged bag along with your external order ID to <strong>support@holstein.in</strong> or via WhatsApp / Toll-Free helpline <strong>1800-296-5555</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Refund Processing</h2>
            <p>
              In accordance with CRM and payment gateway reconciliation protocols (described in <code>PAYMENTS_API.md</code>), authorized refunds for online Razorpay payments are initiated back to the original payment source within 5 to 7 business days following staff reconciliation. Cash orders are settled via direct bank transfer or credit adjustment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

