import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.holstein.in"),
  title: "Holstein — Feed The Future | Dairy Feeds & Ruminant Nutrition",
  description:
    "Official e-commerce website for Holstein Nutrition (MMC Group). High-yield dairy cattle feeds, calf starters, bypass supplements, and veterinary solutions.",
  icons: {
    icon: [
      { url: "/hf.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/hf.png",
    apple: "/hf.png",
  },
  openGraph: {
    title: "Holstein — Feed The Future",
    description:
      "Advancing Dairy. Empowering Farmers. Premium livestock feeds and dairy solutions in India.",
    url: "https://www.holstein.in",
    siteName: "Holstein India",
    images: [
      {
        url: "/hl.png",
        width: 1200,
        height: 630,
        alt: "Holstein Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex flex-col min-h-full">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
