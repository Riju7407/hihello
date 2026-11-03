import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Award, Cpu } from "lucide-react";

export default function WhoWeAre() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Farm & Flagship Feeds Imagery - ab1.png */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[460px] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <Image
                src="/ab1.png"
                alt="Holstein Dairy - Calf Starter, Xtra Milk & Cow Feed"
                width={1254}
                height={1254}
                priority
                className="w-full h-auto block object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="space-y-6">
            <div className="inline-block text-xs font-bold tracking-widest text-brand-forest uppercase bg-brand-surface px-3 py-1 rounded-md border border-brand-border">
              Who We Are
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Building the Future <br className="hidden sm:inline" />
              of Dairy in India
            </h2>

            <p className="text-base text-gray-600 leading-relaxed">
              Holstein India is a trusted livestock feed and dairy solutions provider under the Mahajan Molasses Company (MMC Group). Focused on genetic excellence, scientifically balanced ruminant nutrition, advanced technology, and farmer welfare across Punjab, Haryana, and all of North India.
            </p>

            <div>
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-forest hover:text-brand-dark group"
              >
                <span>Explore About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Pillar Cards Underneath */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-6 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-surface border border-brand-border/60 text-brand-forest flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Animal Health
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Veterinary & herd health management formulations to avoid metabolic stress.
            </p>
          </div>

          <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-6 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-surface border border-brand-border/60 text-brand-forest flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Breeding Excellence
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Breeding & pedigree optimization to unlock genetic potential and peak lactation.
            </p>
          </div>

          <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-6 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-surface border border-brand-border/60 text-brand-forest flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Dairy Intelligence
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Technology-driven dairy operations, ration balancing, and yield analytics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

