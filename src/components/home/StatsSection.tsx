import React from "react";

export default function StatsSection() {
  return (
    <section className="bg-white py-14 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="pt-4 sm:pt-0">
            <p className="text-4xl sm:text-5xl font-black text-brand-forest">200+</p>
            <p className="mt-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Partner Farms
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Commercial dairy operations supported across Punjab & Haryana
            </p>
          </div>

          <div className="pt-6 sm:pt-0">
            <p className="text-4xl sm:text-5xl font-black text-brand-forest">50,000+</p>
            <p className="mt-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Registered Animals
            </p>
            <p className="mt-1 text-xs text-gray-400">
              High-yielding cattle fed on Holstein nutrition programs
            </p>
          </div>

          <div className="pt-6 sm:pt-0">
            <p className="text-4xl sm:text-5xl font-black text-brand-forest">10+</p>
            <p className="mt-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Years of Excellence
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Backed by MMC Group’s decades of agro-industrial leadership
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

