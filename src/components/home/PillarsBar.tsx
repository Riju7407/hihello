import React from "react";
import Link from "next/link";
import { Dna, Apple, Stethoscope, Factory } from "lucide-react";

const PILLARS = [
  {
    name: "Breeding",
    icon: Dna,
    href: "/breed",
    subtitle: "Superior genetics & pedigree",
  },
  {
    name: "Nutrition",
    icon: Apple,
    href: "/products?category=cat_dairy_cattle",
    subtitle: "High-yield balanced feeds",
  },
  {
    name: "Veterinary",
    icon: Stethoscope,
    href: "/solutions",
    subtitle: "Proactive animal healthcare",
  },
  {
    name: "Dairy Solutions",
    icon: Factory,
    href: "/solutions",
    subtitle: "Integrated farm automation",
  },
];

export default function PillarsBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-6 sm:py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.name}
                href={pillar.href}
                className="group flex items-center space-x-3.5 p-3 sm:p-4 rounded-xl hover:bg-brand-surface border border-transparent hover:border-brand-border transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-surface group-hover:bg-brand-forest group-hover:text-white flex items-center justify-center text-brand-forest transition-colors shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-brand-forest transition-colors">
                    {pillar.name}
                  </h3>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {pillar.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

