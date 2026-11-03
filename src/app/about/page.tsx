import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Lightbulb, Leaf, Users, ArrowRight } from "lucide-react";
import StatsSection from "@/components/home/StatsSection";

export const metadata = {
  title: "About Us | Holstein India — Feed The Future",
  description:
    "Learn about Holstein Nutrition Private Limited, part of MMC Group (est. 2001). Our mission, values, partner farms, and commitment to Indian dairy farmers.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* 1. Hero Header Banner matching h2.jpeg & ab3.png */}
      <div className="relative text-white min-h-[340px] sm:min-h-[380px] flex items-center overflow-hidden">
        <Image
          src="/ab3.png"
          alt="About Holstein India - Genetics, Technology, Animal Nutrition"
          fill
          priority
          className="object-cover object-center -z-10"
          sizes="100vw"
        />
        {/* Contrast overlay for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1308]/90 via-[#2A1E0D]/70 to-black/30 -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 text-xs font-semibold tracking-wide uppercase text-brand-border">
            <span>MMC Group Sister Concern</span>
            <span>•</span>
            <span>Est. 2001</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            About Holstein India
          </h1>
          <p className="text-base sm:text-lg text-brand-border max-w-2xl leading-relaxed">
            Driven by genetics. Powered by technology. Committed to a healthier and more productive dairy future.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">About Us</span>
        </div>
      </div>

      {/* 2. Our Mission & Our Vision Section matching reference screenshot */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#EFEAE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Our Mission */}
            <div className="space-y-4">
              <div className="inline-block">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1E1A16] tracking-tight">
                  Our Mission
                </h2>
                <div className="h-[3px] bg-[#B88E4C] mt-2 rounded-xs w-full" />
              </div>
              <p className="text-[15px] sm:text-base text-[#4A443E] leading-[1.75] font-normal">
                At Holstein, we improve cattle health and productivity by producing feed that is rich in nutrients. We believe that healthy cattle are the foundation of a successful farm, and we are committed to producing nutritious, best-quality feed. Using carefully selected, ethically sourced ingredients, we formulate balanced and nutritious feed to enhance livestock well-being and performance. Our focus is providing farmers with reliable feed solutions to promote growth, boost immunity, and support overall cattle health.
              </p>
            </div>

            {/* Our Vision */}
            <div className="space-y-4">
              <div className="inline-block">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1E1A16] tracking-tight">
                  Our Vision
                </h2>
                <div className="h-[3px] bg-[#B88E4C] mt-2 rounded-xs w-full" />
              </div>
              <p className="text-[15px] sm:text-base text-[#4A443E] leading-[1.75] font-normal">
                Our vision at Holstein is to lead the way in producing the highest-quality cattle feed by sourcing the best raw materials and using advanced processing techniques. Leveraging cutting-edge technology and MMC Group&apos;s expertise in procuring key ingredients like molasses, maize, and DORB, we produce feed with top-grade materials. We prioritize R&D in animal nutrition, collaborating with world-renowned experts to ensure high-quality, nutritious feed for livestock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Story Section matching h2.jpeg & ab2.png */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Imagery - ab2.png */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full max-w-[380px] sm:max-w-[420px] rounded-2xl overflow-hidden shadow-lg border border-gray-200/80 bg-white">
                <Image
                  src="/ab2.png"
                  alt="Building the Future of Dairy in India - Holstein India & MMC Group"
                  width={1024}
                  height={1536}
                  priority
                  className="w-full h-auto block"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block text-xs font-bold tracking-widest text-brand-forest uppercase bg-brand-surface px-3 py-1 rounded-md border border-brand-border">
                MMC Group Sister Concern • Est. 2001
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Building the Future <br className="hidden sm:inline" />
                of Dairy in India
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                Holstein India is a trusted partner for dairy farmers, providing world-class genetics, advanced veterinary care, and innovative nutritional technology to help build a sustainable and profitable dairy ecosystem in India.
              </p>

              <p className="text-sm text-gray-600 leading-relaxed">
                As a proud sister concern of the <strong>MMC Group (Mahajan Molasses Company)</strong>, founded in 2001, we leverage over two decades of agricultural sourcing and processing expertise. From direct molasses and grain procurement to automated pelleting mills, every batch of feed meets rigorous nutritional standards.
              </p>

              {/* 3 Core Pillars matching ab2.png poster */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 text-center">
                  <span className="block text-xs font-bold text-gray-900">World-Class Genetics</span>
                  <span className="block text-2xs text-gray-500 mt-0.5">High transmission indexes</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 text-center">
                  <span className="block text-xs font-bold text-gray-900">Advanced Veterinary Care</span>
                  <span className="block text-2xs text-gray-500 mt-0.5">Herd metabolic wellness</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 text-center">
                  <span className="block text-xs font-bold text-gray-900">Nutritional Technology</span>
                  <span className="block text-2xs text-gray-500 mt-0.5">Precision bypass formulas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Row matching h2.jpeg */}
      <StatsSection />

      {/* 4. Our Values matching h2.jpeg */}
      <section className="py-16 sm:py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Values</h2>
            <p className="mt-2 text-sm text-gray-500">
              The principles that steer our feed manufacturing, research, and farmer engagements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand-forest/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center mb-5 border border-brand-border">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Driving progress through technology, bypass nutrient formulations, and precision dairy cattle feeding methodologies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand-forest/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center mb-5 border border-brand-border">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                For a healthier planet, minimizing enteric methane emission through optimal rumen fermentation and ethical sourcing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand-forest/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand-forest flex items-center justify-center mb-5 border border-brand-border">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnership</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Growing together for a better future, standing side-by-side with progressive dairy farmers, dealers, and veterinarians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Join Our Journey Banner matching h2.jpeg */}
      <section className="bg-brand-deep text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Join Our Journey
            </h2>
            <p className="text-brand-border text-sm sm:text-base leading-relaxed">
              Be a part of a smarter, healthier and more productive dairy future. Contact our livestock nutrition specialists today.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white text-brand-forest font-semibold text-sm hover:bg-brand-surface transition-colors shadow-sm shrink-0"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
