import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-gray-800 bg-gray-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-brand-primary/15 text-brand-gold border border-brand-primary/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct Farm Delivery</h4>
                <p className="text-xs text-gray-400">Direct logistics across North India</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-brand-primary/15 text-brand-gold border border-brand-primary/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Quality Assured</h4>
                <p className="text-xs text-gray-400">Lab tested & ISI standard certified</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-brand-primary/15 text-brand-gold border border-brand-primary/30">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Fresh Mill Packaging</h4>
                <p className="text-xs text-gray-400">Triple-laminated moisture-proof bags</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-brand-primary/15 text-brand-gold border border-brand-primary/30">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Toll-Free Farmer Support</h4>
                <p className="text-xs text-gray-400">1800-296-5555 (9 AM - 6 PM)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-14 w-52 bg-white/10 p-2 rounded-lg">
              <Image
                src="/hl.png"
                alt="Holstein Logo"
                fill
                className="object-contain object-left filter brightness-110"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Holstein Nutrition is a premier animal nutrition and dairy solutions enterprise under the MMC Group (Mahajan Molasses Company, est. 2001). Empowering dairy farmers with scientifically formulated feeds, advanced genetics, and sustainable productivity.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300">MMC Group Sister Concern</p>
              <p>Manufacturing high-yield cattle feeds, calf starters, and bypass nutrition solutions.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Products & Solutions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-brand-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat_dairy_cattle" className="hover:text-brand-gold transition-colors">
                  Dairy & Cattle Feed
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat_calf_heifer" className="hover:text-brand-gold transition-colors">
                  Calf & Heifer Growth
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat_transition" className="hover:text-brand-gold transition-colors">
                  Transition Wellness
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat_supplements" className="hover:text-brand-gold transition-colors">
                  Nutritional Supplements
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-brand-gold transition-colors">
                  Farm & Dairy Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Knowledge */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/breed" className="hover:text-brand-gold transition-colors">
                  Holstein Breed & Genetics
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Distributorship Enquiries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-brand-gold transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Corporate Office
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-1" />
                <span>
                  1803, 18th Floor, Omaxe India Trade Tower, New Chandigarh, Punjab – 140901
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>1800-296-5555 / +91-7087416929</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>info@holstein.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Policies and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Holstein Nutrition Private Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-300">
              Terms & Conditions
            </Link>
            <Link href="/shipping-policy" className="hover:text-gray-300">
              Shipping & Delivery Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-gray-300">
              Return & Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

