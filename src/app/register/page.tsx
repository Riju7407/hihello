"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, User, Phone, MapPin, AlertCircle, Loader2, Check } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { refetchCustomer } = useCustomer();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 12) {
      setError("Password must be at least 12 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 409) {
          throw new Error(
            "An account with this email already exists. Please log in instead."
          );
        }
        throw new Error(data?.error?.message || "Registration failed");
      }

      await refetchCustomer();
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      setIsLoading(false);
    }
  };

  const passwordLengthValid = formData.password.length >= 12;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <div className="relative h-12 w-44 mx-auto">
          <Image
            src="/hl.png"
            alt="Holstein Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Create Customer Account
        </h1>
        <p className="text-xs text-gray-500">
          Register to order livestock feed, access farm pricing, and track deliveries.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name / Farm Owner *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              maxLength={160}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Gurpreet Singh"
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="buyer@example.com"
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                required
                maxLength={32}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Password (Minimum 12 characters) *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              minLength={12}
              maxLength={72}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 12 characters..."
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>
          <p
            className={`text-2xs mt-1 flex items-center space-x-1 ${
              passwordLengthValid ? "text-brand-forest font-semibold" : "text-gray-400"
            }`}
          >
            {passwordLengthValid && <Check className="w-3 h-3 shrink-0" />}
            <span>Requires at least 12 characters as mandated by Holstein CRM.</span>
          </p>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Farm / Delivery Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="address"
              required
              maxLength={300}
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Village, Tehsil, Farm Gate Landmark"
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>
        </div>

        {/* City, State, Postal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              City / Town *
            </label>
            <input
              type="text"
              name="city"
              required
              maxLength={100}
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Kapurthala"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              name="state"
              required
              maxLength={100}
              value={formData.state}
              onChange={handleInputChange}
              placeholder="e.g. Punjab"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              PIN Code *
            </label>
            <input
              type="text"
              name="postalCode"
              required
              maxLength={20}
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="e.g. 144601"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !passwordLengthValid}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all disabled:opacity-50 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Account in CRM...</span>
            </>
          ) : (
            <span>Create Account & Sign In</span>
          )}
        </button>
      </form>

      <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
        Already registered?{" "}
        <Link
          href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="font-semibold text-brand-forest hover:underline"
        >
          Customer Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <Suspense fallback={<div className="text-center py-10">Loading registration...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

