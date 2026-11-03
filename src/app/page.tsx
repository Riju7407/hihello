import React from "react";
import Link from "next/link";
import HeroBanner from "@/components/home/HeroBanner";
import PillarsBar from "@/components/home/PillarsBar";
import WhoWeAre from "@/components/home/WhoWeAre";
import NutritiousFeedTicker from "@/components/home/NutritiousFeedTicker";
import HolsteinDifference from "@/components/home/HolsteinDifference";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StatsSection from "@/components/home/StatsSection";
import { ArrowRight, PhoneCall, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Banner matching h1.jpeg */}
      <HeroBanner />

      {/* 2. Pillars Quick Bar matching h1.jpeg */}
      <PillarsBar />

      {/* 3. Who We Are Section matching h1.jpeg & h2.jpeg */}
      <WhoWeAre />

      {/* 4. Nutritious Feed - Healthy Cattle (Moving Seed & Grain Ticker) */}
      <NutritiousFeedTicker />

      {/* 5. The Holstein Difference matching h1.jpeg */}
      <HolsteinDifference />

      {/* 5. Real Backend Products Showcase */}
      <FeaturedProducts />

      {/* 6. Partner & Animal Statistics matching h2.jpeg */}
      <StatsSection />

      {/* 7. Distributorship & Farmer Partnership CTA */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-forest uppercase tracking-wider bg-brand-surface px-3 py-1 rounded-md border border-brand-border">
                <Building2 className="w-3.5 h-3.5" />
                <span>Distributorship & Dealership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Partner with Holstein India in Your Region
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Join our expanding retail and dealer distribution network across North India. Deliver premium cattle feeds and specialized supplements directly to dairy producers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all text-sm shadow-sm"
              >
                <span>Apply for Dealership</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href="tel:18002965555"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all text-sm space-x-2"
              >
                <PhoneCall className="w-4 h-4 text-brand-forest" />
                <span>Call 1800-296-5555</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

