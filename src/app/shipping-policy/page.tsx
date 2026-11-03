import React from "react";
import Link from "next/link";
import { ChevronRight, Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | Holstein India",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Shipping Policy</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Commercial Animal Feed Logistics & Farm Gate Delivery Guidelines
        </p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mb-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <Truck className="w-5 h-5 text-brand-forest mb-2" />
              <h4 className="text-xs font-bold text-gray-900">Direct Mill Dispatch</h4>
              <p className="text-2xs text-gray-500 mt-1">Dispatched directly from regional feed mills</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <Clock className="w-5 h-5 text-brand-forest mb-2" />
              <h4 className="text-xs font-bold text-gray-900">2 to 5 Business Days</h4>
              <p className="text-2xs text-gray-500 mt-1">Standard transit time for North India</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <ShieldCheck className="w-5 h-5 text-brand-forest mb-2" />
              <h4 className="text-xs font-bold text-gray-900">Moisture-Proof</h4>
              <p className="text-2xs text-gray-500 mt-1">Triple-ply HDPE bags protected from rain</p>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Delivery Coverage</h2>
            <p>
              Holstein Nutrition provides direct road logistics across agricultural zones in Punjab, Haryana, Himachal Pradesh, Rajasthan, and western Uttar Pradesh. Deliveries are made directly to designated farm gates or partner dealership retail counters.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Processing & Dispatch Timelines</h2>
            <p>
              Orders submitted before 12:00 PM on business days are scheduled for mill processing within 24 hours. Depending on delivery location and order tonnage, transit time typically ranges between 2 to 5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Unloading & Verification</h2>
            <p>
              Customers or designated farm representatives are requested to verify bag seals, manufacturing dates, and quantities upon truck arrival prior to signing delivery acknowledgment sheets.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Support & Logistics Inquiries</h2>
            <p>
              For dispatch status queries or route coordination, contact our transport desk at 1800-296-5555 or email info@holstein.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

