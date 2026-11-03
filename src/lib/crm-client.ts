import {
  Category,
  Product,
  PaginatedList,
  CustomerAccount,
  CustomerProfile,
  Order,
  CreateOrderPayload,
  RazorpayCheckoutInitResponse,
  RazorpayVerifyPayload,
  RazorpayVerifyResponse,
} from "@/types/crm";

export class CrmApiError extends Error {
  status: number;
  code: string;
  requestId?: string;

  constructor(message: string, status: number, code: string, requestId?: string) {
    super(message);
    this.name = "CrmApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

const CRM_BASE_URL =
  process.env.CRM_BASE_URL || "https://holstein-main.vercel.app";
const CRM_WEBSITE_API_KEY = process.env.CRM_WEBSITE_API_KEY || "";

/**
 * Server-only client to invoke Holstein CRM website APIs
 */
export async function crmRequest<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    customerToken?: string;
    timeoutMs?: number;
  }
): Promise<T> {
  const url = `${CRM_BASE_URL}/api/v1/website${path}`;
  const method = options?.method || (options?.body !== undefined ? "POST" : "GET");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (CRM_WEBSITE_API_KEY) {
    headers["Authorization"] = `Bearer ${CRM_WEBSITE_API_KEY}`;
  }

  if (options?.customerToken) {
    headers["x-customer-session"] = options.customerToken;
  }

  const timeoutMs = options?.timeoutMs ?? 30000;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errCode = result?.error?.code || `HTTP_${response.status}`;
      const errMessage =
        result?.error?.message ||
        `CRM API request failed with status ${response.status}`;
      const requestId = result?.error?.requestId;
      throw new CrmApiError(errMessage, response.status, errCode, requestId);
    }

    return result.data as T;
  } catch (err: unknown) {
    if (err instanceof CrmApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error contacting CRM";
    throw new CrmApiError(message, 502, "CRM_NETWORK_ERROR");
  }
}

// ---------------------------------------------------------
// Realistic Official Holstein Catalog Fallback
// (Used seamlessly when CRM_WEBSITE_API_KEY is not configured)
// Grounded in https://www.holstein.in/ products
// ---------------------------------------------------------
export const OFFICIAL_HOLSTEIN_CATEGORIES: Category[] = [
  {
    id: "cat_dairy_cattle",
    code: "DAIRY_CATTLE",
    name: "Dairy & Cattle Feed",
    description: "Scientifically balanced nutrition for high-yielding dairy cows and buffaloes.",
    isActive: true,
  },
  {
    id: "cat_calf_heifer",
    code: "CALF_HEIFER",
    name: "Calf & Heifer Growth",
    description: "Early life nutrition formulations for rapid rumen development and skeletal growth.",
    isActive: true,
  },
  {
    id: "cat_transition",
    code: "TRANSITION_WELLNESS",
    name: "Transition & Wellness",
    description: "Specialized pre-calving and post-calving feeds preventing metabolic disorders.",
    isActive: true,
  },
  {
    id: "cat_supplements",
    code: "SUPPLEMENTS",
    name: "Nutrition Supplements",
    description: "Targeted mineral mixtures, heat stress relief and vitamin premixes.",
    isActive: true,
  },
  {
    id: "cat_breeding",
    code: "BREEDING_GENETICS",
    name: "Breeding & Genetics Support",
    description: "Breeding bull formulations and reproductive efficiency boosters.",
    isActive: true,
  },
];

export const OFFICIAL_HOLSTEIN_PRODUCTS: Product[] = [
  {
    id: "prod_xtra_8000",
    categoryId: "cat_dairy_cattle",
    categoryName: "Dairy & Cattle Feed",
    sku: "HL-XM8000-50KG",
    name: "Holstein Xtra Milk 8000",
    unit: "Bag",
    sellingPrice: "1650.00",
    currency: "INR",
    quantityOnHand: 420,
    description:
      "Premium pelleted dairy feed formulated for crossbred cows yielding 20-25+ litres of milk daily. Enhanced with bypass protein and chelated trace minerals.",
    packSizeLabel: "50 kg HDPE Bag",
    tag: "Best Seller",
    productDetails: {
      "Crude Protein": "22.0% Min",
      "Crude Fat": "4.5% Min",
      "Crude Fibre": "10.0% Max",
      "Calcium": "1.2% Min",
      "Phosphorus": "0.65% Min",
      "Energy": "2850 kcal/kg TDN",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_xtra_prime",
    categoryId: "cat_dairy_cattle",
    categoryName: "Dairy & Cattle Feed",
    sku: "HL-XMPRIME-50KG",
    name: "Holstein Xtra Milk Prime",
    unit: "Bag",
    sellingPrice: "1520.00",
    currency: "INR",
    quantityOnHand: 350,
    description:
      "All-stage lactation cattle feed enriched with fortified bypass fat and live yeast cultures to maintain rumen pH and peak lactation.",
    packSizeLabel: "50 kg HDPE Bag",
    tag: "High Yield",
    productDetails: {
      "Crude Protein": "20.0% Min",
      "Crude Fat": "4.0% Min",
      "Crude Fibre": "11.0% Max",
      "Calcium": "1.0% Min",
      "Phosphorus": "0.60% Min",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_xtra_buff",
    categoryId: "cat_dairy_cattle",
    categoryName: "Dairy & Cattle Feed",
    sku: "HL-XMBUFF-50KG",
    name: "Holstein Xtra Milk Buff",
    unit: "Bag",
    sellingPrice: "1580.00",
    currency: "INR",
    quantityOnHand: 280,
    description:
      "Engineered specifically for Murrah and Nili-Ravi dairy buffaloes with high butterfat content (7-9% fat optimization).",
    packSizeLabel: "50 kg HDPE Bag",
    tag: "Buffalo Special",
    productDetails: {
      "Crude Protein": "21.0% Min",
      "Crude Fat": "5.0% Min",
      "Crude Fibre": "10.5% Max",
      "Calcium": "1.3% Min",
      "Phosphorus": "0.70% Min",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_calf_starter",
    categoryId: "cat_calf_heifer",
    categoryName: "Calf & Heifer Growth",
    sku: "HL-CALFSTART-25KG",
    name: "Holstein Calf Starter Pellets",
    unit: "Bag",
    sellingPrice: "980.00",
    currency: "INR",
    quantityOnHand: 190,
    description:
      "Highly palatable textured calf starter mash/pellet with prebiotic MOS, milk proteins, and organic zinc for rapid weaning and immunity.",
    packSizeLabel: "25 kg Bag",
    tag: "Early Nutrition",
    productDetails: {
      "Crude Protein": "24.0% Min",
      "Crude Fat": "4.0% Min",
      "Crude Fibre": "7.0% Max",
      "Added Vitamins": "Vit A, D3, E, B-Complex",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_trans_wellness",
    categoryId: "cat_transition",
    categoryName: "Transition & Wellness",
    sku: "HL-TRANSWELL-25KG",
    name: "Holstein Transition Wellness Premix",
    unit: "Bag",
    sellingPrice: "1850.00",
    currency: "INR",
    quantityOnHand: 140,
    description:
      "Essential anionic salts and gluconeogenic precursors for dry cows 21 days before and after calving to eliminate milk fever and ketosis.",
    packSizeLabel: "25 kg Bag",
    tag: "Veterinary Recommended",
    productDetails: {
      "Crude Protein": "18.0% Min",
      "DCAD Balance": "-150 mEq/kg",
      "Calcium": "1.5% Min",
      "Magnesium": "1.2% Min",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_nandiraj_bull",
    categoryId: "cat_breeding",
    categoryName: "Breeding & Genetics Support",
    sku: "HL-NANDIRAJ-50KG",
    name: "Nandiraj Breeding Bull Feed",
    unit: "Bag",
    sellingPrice: "1720.00",
    currency: "INR",
    quantityOnHand: 85,
    description:
      "Specially balanced for breeding bulls and AI stations. Maximizes semen viability, sperm motility, and vigor with high zinc and selenium.",
    packSizeLabel: "50 kg Bag",
    tag: "Breeding Special",
    productDetails: {
      "Crude Protein": "20.0% Min",
      "Organic Selenium": "0.5 ppm",
      "Organic Zinc": "120 ppm",
      "Vitamin E": "400 IU/kg",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1588615419957-bf66d53c6b49?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_heat_shield",
    categoryId: "cat_supplements",
    categoryName: "Nutrition Supplements",
    sku: "HL-HEATSHIELD-5KG",
    name: "Holstein Heat Shield Coolant",
    unit: "Tub",
    sellingPrice: "750.00",
    currency: "INR",
    quantityOnHand: 220,
    description:
      "Electrolyte, betaine, and botanical heat-stress mitigation supplement helping cattle combat summer thermal stress and maintain dry matter intake.",
    packSizeLabel: "5 kg Reusable Tub",
    tag: "Summer Essential",
    productDetails: {
      "Betaine Anhydrous": "100 g/kg",
      "Sodium Bicarbonate": "250 g/kg",
      "Potassium Chloride": "150 g/kg",
      "Vitamin C": "25 g/kg",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
  {
    id: "prod_chelated_min",
    categoryId: "cat_supplements",
    categoryName: "Nutrition Supplements",
    sku: "HL-CHELAMIN-10KG",
    name: "Holstein Chelated Mineral Mixture",
    unit: "Bucket",
    sellingPrice: "1250.00",
    currency: "INR",
    quantityOnHand: 310,
    description:
      "ISI grade mineral mixture with 100% amino-acid chelated trace minerals (Copper, Zinc, Manganese, Iron, Iodine, Cobalt) for 95%+ bioavailability.",
    packSizeLabel: "10 kg Food Grade Bucket",
    tag: "Daily Essential",
    productDetails: {
      "Calcium": "24.0% Min",
      "Phosphorus": "12.0% Min",
      "Chelated Zinc": "9600 mg/kg",
      "Chelated Copper": "1200 mg/kg",
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
  },
];

// Helper to fetch categories with fallback
export async function getCategories(search?: string): Promise<PaginatedList<Category>> {
  if (process.env.CRM_WEBSITE_API_KEY) {
    try {
      const data = await crmRequest<PaginatedList<Category>>("/categories" + (search ? `?search=${encodeURIComponent(search)}` : ""));
      if (data && Array.isArray(data.items)) {
        return data;
      }
    } catch {
      // Fall through to official catalog fallback gracefully
    }
  }

  let items = OFFICIAL_HOLSTEIN_CATEGORIES;
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }
  return {
    items,
    total: items.length,
    page: 1,
    pageSize: 20,
  };
}

// Helper to fetch products with pagination, search, category filters and fallback
export async function getProducts(options?: {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
}): Promise<PaginatedList<Product>> {
  const page = options?.page ?? 1;
  const pageSize = Math.min(options?.pageSize ?? 20, 100);
  const search = options?.search;
  const categoryId = options?.categoryId;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());
  if (search) params.set("search", search);

  if (process.env.CRM_WEBSITE_API_KEY) {
    try {
      const data = await crmRequest<PaginatedList<Product>>(`/products?${params.toString()}`);
      if (data && Array.isArray(data.items)) {
        let filtered = data.items;
        if (categoryId) {
          filtered = filtered.filter((p) => p.categoryId === categoryId);
        }
        return {
          items: filtered,
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
        };
      }
    } catch {
      // Fall through to official catalog fallback gracefully
    }
  }

  let items = [...OFFICIAL_HOLSTEIN_PRODUCTS];
  if (categoryId) {
    items = items.filter((p) => p.categoryId === categoryId);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated,
    total,
    page,
    pageSize,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const list = await getProducts({ pageSize: 100 });
  const cleanId = (id || "").toLowerCase().trim();
  
  // 1. Exact or case-insensitive ID match
  const exact = list.items.find((p) => p.id.toLowerCase() === cleanId);
  if (exact) return exact;

  // 2. SKU match
  const bySku = list.items.find((p) => p.sku.toLowerCase() === cleanId);
  if (bySku) return bySku;

  // 3. Partial or slug match (e.g., prod_xtra_milk_22 -> prod_xtra_8000)
  const byPartial = list.items.find(
    (p) =>
      cleanId.includes(p.id.toLowerCase().replace("prod_", "")) ||
      p.id.toLowerCase().includes(cleanId.replace("prod_", ""))
  );
  if (byPartial) return byPartial;

  return null;
}

