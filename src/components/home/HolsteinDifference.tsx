"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Dna, FileText, Sparkles, HeartPulse, Gauge } from "lucide-react";

const DIFFERENCE_TABS = [
  {
    id: "characteristics",
    title: "Breed Characteristics",
    icon: Sparkles,
    shortDesc: "Distinctive black-and-white markings, robust skeletal frame, and superior milk synthesis capacity.",
  },
  {
    id: "pedigree",
    title: "Pedigree Records",
    icon: FileText,
    shortDesc: "Documented lineage tracing generations of high-producing dams and proven genetic transmitting bulls.",
  },
  {
    id: "genetics",
    title: "Proven Genetics",
    icon: Dna,
    shortDesc: "Genomic indexes tailored for high solids-not-fat (SNF), butterfat retention, and heat tolerance.",
  },
  {
    id: "breeding",
    title: "Breeding Strategy",
    icon: HeartPulse,
    shortDesc: "Precision artificial insemination and sexed semen protocols minimizing calving intervals.",
  },
  {
    id: "performance",
    title: "Animal Performance",
    icon: Gauge,
    shortDesc: "Proven ability to achieve 8,000 to 12,000+ litres per 305-day lactation cycle with optimal feeding.",
  },
];

export default function HolsteinDifference() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-brand-deep text-white py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                The Holstein Difference
              </h2>
              <p className="mt-2 text-base text-brand-border">
                Superior genetics. Better productivity. A healthier tomorrow.
              </p>
            </div>

            {/* 5 Tab Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {DIFFERENCE_TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isSelected = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-white/15 border-brand-gold shadow-sm"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-brand-border"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-brand-gold" : "text-brand-border"}`} />
                    <span className="text-xs sm:text-sm font-semibold block leading-snug">
                      {tab.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Explanation Box */}
            <div className="p-5 rounded-xl bg-black/20 border border-white/10 text-brand-surface text-sm leading-relaxed backdrop-blur-xs">
              <span className="font-semibold text-white block mb-1">
                {DIFFERENCE_TABS[activeTab].title}:
              </span>
              {DIFFERENCE_TABS[activeTab].shortDesc}
            </div>

            <div>
              <Link
                href="/breed"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-brand-forest font-semibold text-sm hover:bg-brand-surface transition-colors shadow-sm"
              >
                <span>Explore Holstein Breed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column Cow Image */}
          <div className="lg:col-span-5 relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80"
              alt="Holstein cow"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

