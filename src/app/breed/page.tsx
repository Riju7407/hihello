"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Milk,
  HeartHandshake,
  ShieldCheck,
  Dna,
  FileText,
  Sparkles,
  HeartPulse,
} from "lucide-react";

const TABS = [
  "Overview",
  "Characteristics",
  "Pedigree",
  "Genetics",
  "Breeding",
  "Performance",
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1588615419957-bf66d53c6b49?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
];

export default function BreedPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="bg-white">
      {/* 1. Hero Banner matching h3.jpeg */}
      <div className="relative bg-brand-deep text-white min-h-[300px] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=2000&q=80"
          alt="Holstein cow herd"
          fill
          priority
          className="object-cover object-center opacity-35"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Holstein Breed
          </h1>
          <p className="text-base sm:text-lg text-brand-border max-w-xl">
            The world&apos;s most trusted dairy breed.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-600">Holstein</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Holstein Breed</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching h3.jpeg */}
      <div className="border-b border-gray-200 bg-white sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-brand-forest text-brand-forest"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Genetics & Performance Content Section matching h3.jpeg */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                World-Class Genetics <br />
                for Superior Performance
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                The Holstein breed is renowned worldwide for its unmatched milk production capacity, rapid maturation, and genetic adaptability. When combined with our precision cattle feed formulations like <strong>Holstein Xtra Milk</strong>, cows realize their full potential in commercial Indian climates.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Whether you manage purebred Holstein-Friesian herds or HF-crossbred cattle, maintaining nutritional equilibrium with chelated minerals and bypass fat ensures longevity, lower somatic cell counts, and consistent lactation persistence.
              </p>
            </div>

            {/* Right 3 Highlights matching h3.jpeg */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200/70">
                <div className="p-2.5 rounded-lg bg-brand-surface text-brand-forest shrink-0 border border-brand-border">
                  <Milk className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">High Milk Production</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Up to 12,000+ L per lactation under balanced total mixed ration (TMR) feeding.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200/70">
                <div className="p-2.5 rounded-lg bg-brand-surface text-brand-forest shrink-0 border border-brand-border">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Excellent Fertility</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Better reproductive efficiency, shorter service periods, and reduced calving intervals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200/70">
                <div className="p-2.5 rounded-lg bg-brand-surface text-brand-forest shrink-0 border border-brand-border">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Strong Adaptability</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Thrives in diverse Indian agro-climatic conditions with proper heat-mitigation feeding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Photo Gallery matching h3.jpeg */}
          <div className="mt-14 space-y-4">
            <div className="relative aspect-16/8 sm:aspect-21/9 rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <Image
                src={GALLERY_IMAGES[selectedImage]}
                alt="Holstein breed herd photo"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* 6 Thumbnail Strip */}
            <div className="grid grid-cols-6 gap-2 sm:gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-brand-forest ring-2 ring-brand-forest/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 4. Breed Highlights 2x2 Grid matching h3.jpeg */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Breed Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center shrink-0 border border-brand-border">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Breed Characteristics</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Physical traits, distinct piebald pigmentation, sound feet and leg conformation, and capacious udder attachment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center shrink-0 border border-brand-border">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Pedigree Records</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Verified lineage & ancestry documentation tracking maternal grandsires, lifetime milk fat yield, and daughter pregnancy rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center shrink-0 border border-brand-border">
                  <Dna className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Genetics & Genomics</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Proven genomic breeding values (GEBV) ensuring consistency across calving ease, mastitis resistance, and feed efficiency.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center shrink-0 border border-brand-border">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Breeding Solutions</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Cryo-preserved high-genetic merit semen, embryo transfer assistance, and synchronization feeding packages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

