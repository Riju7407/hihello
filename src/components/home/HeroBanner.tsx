import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center">
      {/* Official Holstein Hero Panorama Image */}
      <Image
        src="/hb1.png"
        alt="Holstein India - Advancing Dairy, Empowering Farmers"
        fill
        priority
        className="object-cover object-center -z-10"
        sizes="100vw"
      />

      {/* Elegant dark gradient overlay for crystal-clear text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1308]/90 via-[#2A1E0D]/65 to-black/25 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-2xl text-white space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-xs border border-white/20 text-xs font-semibold tracking-wide uppercase text-brand-border">
            <span>MMC Group Sister Concern</span>
            <span>•</span>
            <span>Est. 2001</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Advancing Dairy. <br />
            <span className="text-brand-gold">Empowering Farmers.</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-surface leading-relaxed font-normal">
            Building a smarter ecosystem for cattle, dairy farms, breeding, nutrition and animal management. Science-backed feeds designed for peak milk yields and livestock vitality.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all shadow-md text-sm sm:text-base"
            >
              Explore Holstein India
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/40 transition-all text-sm sm:text-base space-x-2 backdrop-blur-xs"
            >
              <span>Shop Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

