"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";

const NAV_ITEMS = [
  { name: "Overview", href: "/account", icon: LayoutDashboard },
  { name: "My Orders", href: "/account/orders", icon: Package },
  { name: "My Profile", href: "/account/profile", icon: User },
  { name: "Delivery Address", href: "/account/address", icon: MapPin },
  { name: "Change Password", href: "/account/change-password", icon: Lock },
];

export default function AccountNav() {
  const pathname = usePathname();
  const { customer, logout, isLoggingOut } = useCustomer();

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6">
      {/* User Greeting */}
      <div className="border-b border-gray-100 pb-4">
        <p className="text-xs text-gray-400">Signed in as</p>
        <p className="text-base font-bold text-gray-900 truncate">
          {customer?.name || "Customer"}
        </p>
        <p className="text-xs text-gray-500 truncate">{customer?.email}</p>
      </div>

      {/* Nav List */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-brand-surface text-brand-forest border border-brand-border"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </nav>
    </aside>
  );
}

