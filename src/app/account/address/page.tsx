"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";

export default function AddressManagementPage() {
  const { customer } = useCustomer();
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer?.externalCustomerId) {
      fetch(`/api/customers/${customer.externalCustomerId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((d) => {
          if (d?.success && d.data) {
            setAddressData({
              name: d.data.name || customer.name || "",
              phone: d.data.phone || "",
              address: d.data.address || "",
              city: d.data.city || "",
              state: d.data.state || "",
              postalCode: d.data.postalCode || "",
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer?.externalCustomerId) return;
    setIsSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch(`/api/customers/${customer.externalCustomerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Failed to update address");
      }

      setSuccess("Delivery address updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving address";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-forest mx-auto mb-2" />
        <p className="text-xs text-gray-500">Loading address details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Farm Delivery Address
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          This address is automatically pre-filled when you place new feed orders.
        </p>
      </div>

      {success && (
        <div className="p-3.5 bg-brand-surface border border-brand-border rounded-xl flex items-center space-x-2.5 text-xs text-brand-dark">
          <Check className="w-4 h-4 text-brand-forest shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Recipient / Representative *
          </label>
          <input
            type="text"
            name="name"
            required
            value={addressData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Contact Phone *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={addressData.phone}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Street / Farm Gate Location *
          </label>
          <input
            type="text"
            name="address"
            required
            value={addressData.address}
            onChange={handleChange}
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
              value={addressData.city}
              onChange={handleChange}
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
              value={addressData.state}
              onChange={handleChange}
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
              value={addressData.postalCode}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving Address..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}

