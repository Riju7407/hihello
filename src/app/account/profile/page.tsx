"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { CustomerProfile } from "@/types/crm";

export default function ProfilePage() {
  const { customer, refetchCustomer } = useCustomer();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer?.externalCustomerId) {
      fetch(`/api/customers/${customer.externalCustomerId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data.data) {
            setProfile(data.data);
            setFormData({
              name: data.data.name || customer.name || "",
              phone: data.data.phone || "",
              address: data.data.address || "",
              city: data.data.city || "",
              state: data.data.state || "",
              postalCode: data.data.postalCode || "",
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer?.externalCustomerId) return;

    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/customers/${customer.externalCustomerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Failed to update profile");
      }

      setSuccessMessage("Profile updated successfully in Holstein CRM.");
      await refetchCustomer();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving profile";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-forest mx-auto mb-2" />
        <p className="text-xs text-gray-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Customer Profile
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review and update your contact and billing details in Holstein CRM.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-brand-surface border border-brand-border rounded-xl flex items-center space-x-2.5 text-xs text-brand-dark">
          <Check className="w-4 h-4 text-brand-forest shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Customer Reference ID
          </label>
          <input
            type="text"
            disabled
            value={customer?.externalCustomerId || ""}
            className="w-full px-3.5 py-2 text-xs font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Account Email (Login Identifier)
          </label>
          <input
            type="email"
            disabled
            value={customer?.email || ""}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-2xs text-gray-400 mt-1">
            Note: As per CUSTOMER_AUTH_API.md, login email is an immutable identity anchor.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name / Farm Representative *
          </label>
          <input
            type="text"
            name="name"
            required
            maxLength={160}
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            maxLength={32}
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Primary Farm / Delivery Address *
          </label>
          <input
            type="text"
            name="address"
            required
            maxLength={300}
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              City / Tehsil *
            </label>
            <input
              type="text"
              name="city"
              required
              maxLength={100}
              value={formData.city}
              onChange={handleInputChange}
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
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              required
              maxLength={20}
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to CRM...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

