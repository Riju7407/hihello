import { MetadataRoute } from "next";
import { OFFICIAL_HOLSTEIN_PRODUCTS, OFFICIAL_HOLSTEIN_CATEGORIES } from "@/lib/crm-client";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.holstein.in";

  const staticPages = [
    "",
    "/about",
    "/breed",
    "/solutions",
    "/products",
    "/categories",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/shipping-policy",
    "/refund-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productPages = OFFICIAL_HOLSTEIN_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/products/${prod.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryPages = OFFICIAL_HOLSTEIN_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/products?category=${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}

