"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomer } from "@/hooks/useCustomer";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Holstein", href: "/breed" },
  { name: "Solutions", href: "/solutions" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const { customer, isAuthenticated } = useCustomer();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-forest/20 rounded-md"
            >
              <div className="relative h-12 w-48 sm:h-14 sm:w-56">
                <Image
                  src="/hl.png"
                  alt="Holstein - Feed The Future"
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 192px, 224px"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-brand-forest font-semibold"
                        : "text-gray-600 hover:text-brand-forest"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search products"
                className="p-2 text-gray-700 hover:text-brand-forest hover:bg-gray-50 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Icon with badge */}
              <button
                type="button"
                onClick={openCart}
                aria-label="Shopping Cart"
                className="relative p-2 text-gray-700 hover:text-brand-forest hover:bg-gray-50 rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-forest rounded-full min-w-[20px]">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* User Account or Get Started Button */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-800 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <User className="w-4 h-4 text-brand-forest" />
                  <span className="max-w-[120px] truncate">{customer?.name || "Account"}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-forest hover:bg-brand-dark transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 text-gray-700 hover:text-brand-forest rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col z-50 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="relative h-10 w-36">
                <Image
                  src="/hl.png"
                  alt="Holstein"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 flex-1 overflow-y-auto space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-brand-surface hover:text-brand-forest transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              {isAuthenticated ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-800 border border-gray-200 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-2 text-brand-forest" />
                  My Account ({customer?.name})
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium text-white bg-brand-forest hover:bg-brand-dark"
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-brand-forest border border-brand-forest/20 hover:bg-brand-surface"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSearchModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Search Holstein Products & Feeds
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by feed name, SKU (e.g., Xtra Milk, Calf Starter)..."
                  className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-brand-forest text-gray-900"
                  autoFocus
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Popular: Xtra Milk 8000, Calf Starter, Nandiraj Bull Feed</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-forest text-white rounded-lg font-medium hover:bg-brand-dark"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

