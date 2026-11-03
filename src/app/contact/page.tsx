"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Contact Us</span>
        </div>

        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Get in Touch with Holstein India
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Have questions regarding bulk livestock feed procurement, distributorship partnerships, or ration balancing? Our agricultural nutrition team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Office & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Corporate Office */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 space-y-3">
              <div className="flex items-center space-x-2 text-brand-forest font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Corporate Office (Mohali / Chandigarh)</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                1803, 18th Floor, Omaxe India Trade Tower, New Chandigarh (Mullanpur, Mohali), Punjab, India – 140901
              </p>
            </div>

            {/* MMC Head Office */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 space-y-3">
              <div className="flex items-center space-x-2 text-brand-forest font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>MMC Group Head Office</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                S.C.O. No. 28, Jama Masjid Complex, Circular Road, Kapurthala, Punjab, India – 144601
              </p>
            </div>

            {/* Communication Details */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-start space-x-3 text-xs text-gray-600">
                <Phone className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">Toll-Free Numbers</span>
                  <span>1800-296-5555 / 1800-296-5510</span>
                  <span className="block text-gray-400 mt-0.5">Mobile: +91-7087416929</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-gray-600">
                <Mail className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">Email Inquiries</span>
                  <span>info@holstein.in</span>
                  <span className="block text-gray-400 mt-0.5">support@holstein.in</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-gray-600">
                <Clock className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">Operating Hours</span>
                  <span>Monday – Saturday: 9:00 AM – 6:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Send an Enquiry
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill in your details and our regional representative will contact you within 24 hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-surface text-brand-forest flex items-center justify-center mx-auto border border-brand-border">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Thank you for reaching out!
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Your inquiry has been received. Our livestock nutrition team will connect with you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-brand-forest hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Gurpreet Singh"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="buyer@example.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Enquiry Category *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest bg-white"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="feed_order">Bulk Cattle Feed Order</option>
                      <option value="dealership">Dealership / Distributorship</option>
                      <option value="veterinary">Veterinary & Nutrition Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Message / Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Please share details such as herd size, location, and specific feed requirements..."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-brand-forest hover:bg-brand-dark transition-all shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

