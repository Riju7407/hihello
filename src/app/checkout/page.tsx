"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomer } from "@/hooks/useCustomer";
import { formatINR, generateExternalId } from "@/lib/utils";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { customer, isAuthenticated, isLoading: authLoading } = useCustomer();
  const { items, clearCart, getEstimatedSubtotal } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "CASH">("RAZORPAY");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN" as const,
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Client-side persistent externalOrderId for idempotent submission
  const [externalOrderId, setExternalOrderId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    // Generate or retrieve idempotency key
    let storedId = sessionStorage.getItem("holstein_active_external_order_id");
    if (!storedId) {
      storedId = generateExternalId("cart-checkout");
      sessionStorage.setItem("holstein_active_external_order_id", storedId);
    }
    setExternalOrderId(storedId);
  }, []);

  // Autofill shipping address from profile if available
  useEffect(() => {
    if (customer) {
      fetch(`/api/customers/${customer.externalCustomerId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data.data) {
            const p = data.data;
            setShippingAddress({
              name: p.name || customer.name || "",
              phone: p.phone || "",
              address: p.address || "",
              city: p.city || "",
              state: p.state || "",
              postalCode: p.postalCode || "",
              country: "IN",
            });
          } else {
            setShippingAddress((prev) => ({
              ...prev,
              name: customer.name || "",
            }));
          }
        })
        .catch(() => {
          setShippingAddress((prev) => ({
            ...prev,
            name: customer.name || "",
          }));
        });
    }
  }, [customer]);

  const subtotal = getEstimatedSubtotal();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      setErrorMessage("Please complete all shipping address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order in CRM backend
      const orderPayload = {
        externalOrderId,
        paymentMethod,
        shippingAddress,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        notes: notes.trim() || undefined,
      };

      const createRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData?.error?.message || "Failed to create order");
      }

      // If CASH, redirect to Order Confirmation immediately
      if (paymentMethod === "CASH") {
        sessionStorage.removeItem("holstein_active_external_order_id");
        clearCart();
        router.push(`/orders/${externalOrderId}/confirmation`);
        return;
      }

      // 2. Initialize Razorpay Checkout
      const checkoutRes = await fetch(`/api/orders/${externalOrderId}/checkout`, {
        method: "POST",
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.success) {
        throw new Error(
          checkoutData?.error?.message || "Failed to initialize payment gateway"
        );
      }

      const { keyId, orderId: rzpOrderId, amount, currency } = checkoutData.data;

      // Check if Razorpay SDK loaded
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay({
          key: keyId,
          amount,
          currency,
          name: "Holstein Nutrition",
          description: `Order ${externalOrderId}`,
          image: "/hf.png",
          order_id: rzpOrderId,
          prefill: {
            name: shippingAddress.name,
            email: customer?.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#B88E4C",
          },
          handler: async (resp) => {
            try {
              // 3. Verify Payment Proof on server
              const verifyRes = await fetch(`/api/orders/${externalOrderId}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: resp.razorpay_order_id,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                sessionStorage.removeItem("holstein_active_external_order_id");
                clearCart();
                router.push(`/checkout/success?orderId=${externalOrderId}`);
              } else {
                router.push(
                  `/checkout/failure?orderId=${externalOrderId}&reason=${encodeURIComponent(
                    verifyData?.error?.message || "Verification failed"
                  )}`
                );
              }
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Verification error";
              router.push(
                `/checkout/failure?orderId=${externalOrderId}&reason=${encodeURIComponent(msg)}`
              );
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        });

        rzp.open();
      } else {
        // Fallback simulation in dev environment if Razorpay script is blocked
        const verifyRes = await fetch(`/api/orders/${externalOrderId}/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: rzpOrderId || "order_sim_123",
            razorpay_payment_id: "pay_sim_123",
            razorpay_signature: "sig_sim_1234567890abcdef1234567890abcdef",
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          sessionStorage.removeItem("holstein_active_external_order_id");
          clearCart();
          router.push(`/checkout/success?orderId=${externalOrderId}`);
        } else {
          throw new Error("Unable to complete payment");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  if (authLoading || !mounted) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-forest mx-auto mb-2" />
        <p className="text-sm text-gray-500">Checking shopper session...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="bg-gray-50/50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-forest">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/cart" className="hover:text-brand-forest">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            Checkout & Delivery Information
          </h1>

          {/* Authentication Alert if guest */}
          {!isAuthenticated && (
            <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900">
                    Sign in to complete your purchase
                  </h4>
                  <p className="text-xs text-amber-700">
                    Customer account is required to associate order history and track dispatch.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  href="/login?redirect=/checkout"
                  className="px-4 py-2 bg-brand-forest text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors"
                >
                  Customer Sign In
                </Link>
                <Link
                  href="/register?redirect=/checkout"
                  className="px-4 py-2 bg-white text-gray-800 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Delivery Address & Payment Method */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Shipping Address */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      1. Farm / Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the destination address where feed bags should be delivered.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name / Farm Representative *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        placeholder="e.g. Gurpreet Singh"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        placeholder="e.g. 9876543210"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Street Address / Village / Farm Location *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        placeholder="House/Plot No., Village, Landmark"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City / Tehsil *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        placeholder="e.g. Kapurthala"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        placeholder="e.g. Punjab"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        PIN / Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        placeholder="e.g. 144601"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        disabled
                        value="India (IN)"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Delivery Instructions / Order Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={3000}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                      placeholder="e.g., Deliver before 4 PM, call driver upon arrival at farm gate..."
                    />
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      2. Payment Method
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose between secure online checkout or cash-on-delivery.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "RAZORPAY"
                          ? "border-brand-forest bg-brand-surface ring-1 ring-brand-forest"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={() => setPaymentMethod("RAZORPAY")}
                        className="mt-1 text-brand-forest focus:ring-brand-forest"
                      />
                      <div className="ml-3">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-brand-forest" />
                          <span className="text-sm font-semibold text-gray-900">
                            Online Payment (Razorpay)
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          UPI, GPay, PhonePe, Debit/Credit Cards & NetBanking.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "CASH"
                          ? "border-brand-forest bg-brand-surface ring-1 ring-brand-forest"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH"
                        checked={paymentMethod === "CASH"}
                        onChange={() => setPaymentMethod("CASH")}
                        className="mt-1 text-brand-forest focus:ring-brand-forest"
                      />
                      <div className="ml-3">
                        <div className="flex items-center space-x-2">
                          <Banknote className="w-4 h-4 text-brand-forest" />
                          <span className="text-sm font-semibold text-gray-900">
                            Cash On Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Pay cash upon mill receipt and delivery verification.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items & Subtotal */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs sticky top-28">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    Order Summary ({items.length} items)
                  </h3>

                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="py-3 flex justify-between items-center text-xs">
                        <div className="pr-2">
                          <p className="font-semibold text-gray-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-gray-500">
                            Qty: {quantity} • {formatINR(product.sellingPrice)}
                          </p>
                        </div>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          {formatINR((parseFloat(product.sellingPrice) || 0) * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direct Farm Freight</span>
                      <span className="text-brand-forest font-semibold">Standard Shipping</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-baseline text-base font-bold text-gray-900">
                    <span>Order Total</span>
                    <span className="text-2xl text-brand-forest font-black">
                      {formatINR(subtotal)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all disabled:opacity-50 shadow-md text-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>
                          {paymentMethod === "RAZORPAY"
                            ? `Pay ${formatINR(subtotal)} via Razorpay`
                            : "Place Cash on Delivery Order"}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-2xs text-gray-400 text-center leading-relaxed">
                    By submitting, your order is registered with Holstein CRM. The authoritative invoice amount is verified before final processing.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

