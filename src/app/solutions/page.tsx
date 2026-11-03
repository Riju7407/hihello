import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Dairy Solutions | Holstein India",
  description:
    "Integrated agricultural and livestock solutions: farm management, veterinary care, breeding records, and milk analytics.",
};

const SOLUTIONS = [
  {
    number: "01",
    title: "Farm Management",
    desc: "Manage farms, animals and performance. Comprehensive tracking of herd demographics, daily feed intake, and shed environmental controls.",
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80",
    href: "/contact?topic=farm_management",
  },
  {
    number: "02",
    title: "Veterinary Care",
    desc: "Health, treatment and follow-ups. Preventative vaccination schedules, metabolic disorder prevention, and on-farm veterinarian consultations.",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
    href: "/contact?topic=veterinary_care",
  },
  {
    number: "03",
    title: "Breeding Management",
    desc: "Breeding, AI and pedigree records. Precision heat detection, conception rate analytics, and genetic index optimization for maximum herd value.",
    image:
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80",
    href: "/breed",
  },
  {
    number: "04",
    title: "Milk Management",
    desc: "Collection, quality and analytics. Automated bulk milk chillers, real-time fat and SNF testing, and clean milk harvesting protocols.",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80",
    href: "/contact?topic=milk_management",
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-white">
      {/* 1. Hero Banner matching h4.jpeg */}
      <div className="relative bg-brand-deep text-white min-h-[300px] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=2000&q=80"
          alt="Dairy Farm Solutions"
          fill
          priority
          className="object-cover object-center opacity-35"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Dairy Solutions
          </h1>
          <p className="text-base sm:text-lg text-brand-border max-w-xl">
            Integrated technology for smarter, healthier and more productive dairy farms.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Solutions</span>
        </div>
      </div>

      {/* 2. Solutions Section matching h4.jpeg */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Our Solutions
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Powerful tools to manage your farm, animals and productivity — all in one platform.
            </p>
          </div>

          {/* 4 Cards Grid matching h4.jpeg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOLUTIONS.map((sol) => (
              <div
                key={sol.number}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-16/9 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={sol.image}
                    alt={sol.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content with Number Badge */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div className="flex items-start space-x-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-sm shrink-0">
                      {sol.number}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-forest transition-colors">
                        {sol.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                        {sol.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      href={sol.href}
                      className="inline-flex items-center text-sm font-semibold text-brand-forest hover:text-brand-dark group/link"
                    >
                      <span>Explore {sol.title}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bottom Banner matching h4.jpeg */}
      <section className="bg-brand-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Technology. Expertise. Better Dairy.
          </h2>
          <p className="text-brand-border max-w-xl mx-auto text-sm sm:text-base">
            Everything you need for a profitable and sustainable dairy enterprise.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white text-brand-forest font-semibold text-sm hover:bg-brand-surface transition-colors shadow-sm"
            >
              <span>Explore All Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

