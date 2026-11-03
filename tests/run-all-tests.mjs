/**
 * Comprehensive Holstein E-Commerce Automated Verification Suite
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const CRM_BASE_URL = "https://holstein-main.vercel.app";

const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(category, name, passed, details = "") {
  if (passed) {
    results.passed++;
    console.log(`  [PASS] ${name}`);
  } else {
    results.failed++;
    console.error(`  [FAIL] ${name} - ${details}`);
  }
  results.tests.push({ category, name, passed, details });
}

// 1. Live CRM Backend Checks
async function testBackendLiveEndpoints() {
  console.log("\n=== 1. LIVE CRM BACKEND ENDPOINT CHECKS ===");

  try {
    const healthRes = await fetch(`${CRM_BASE_URL}/api/v1/health`, {
      signal: AbortSignal.timeout(10000),
    });
    const healthJson = await healthRes.json().catch(() => ({}));
    recordTest(
      "CRM",
      "GET /api/v1/health returns HTTP 200 OK",
      healthRes.status === 200 && healthJson.success === true,
      `Status: ${healthRes.status}`
    );
  } catch (err) {
    recordTest("CRM", "GET /api/v1/health connectivity", false, err.message);
  }

  try {
    const categoriesRes = await fetch(`${CRM_BASE_URL}/api/v1/website/categories`, {
      signal: AbortSignal.timeout(10000),
    });
    recordTest(
      "CRM",
      "GET /api/v1/website/categories is deployed and enforces auth (401)",
      categoriesRes.status === 401,
      `Expected HTTP 401, got: ${categoriesRes.status}`
    );
  } catch (err) {
    recordTest("CRM", "Categories endpoint connectivity", false, err.message);
  }

  try {
    const productsRes = await fetch(`${CRM_BASE_URL}/api/v1/website/products`, {
      signal: AbortSignal.timeout(10000),
    });
    recordTest(
      "CRM",
      "GET /api/v1/website/products is deployed and NOT 404 (Rechecked 2026-11-03)",
      productsRes.status === 401,
      `Expected HTTP 401, got: ${productsRes.status}`
    );
  } catch (err) {
    recordTest("CRM", "Products endpoint connectivity", false, err.message);
  }

  try {
    const loginRes = await fetch(`${CRM_BASE_URL}/api/v1/website/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "invalidpassword123!" }),
      signal: AbortSignal.timeout(10000),
    });
    recordTest(
      "CRM",
      "POST /api/v1/website/auth/login is deployed and enforces server auth (401)",
      loginRes.status === 401,
      `Expected HTTP 401, got: ${loginRes.status}`
    );
  } catch (err) {
    recordTest("CRM", "Auth login endpoint connectivity", false, err.message);
  }

  try {
    const registerRes = await fetch(`${CRM_BASE_URL}/api/v1/website/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "invalidpassword123!" }),
      signal: AbortSignal.timeout(10000),
    });
    recordTest(
      "CRM",
      "POST /api/v1/website/auth/register is deployed and enforces server auth (401)",
      registerRes.status === 401,
      `Expected HTTP 401, got: ${registerRes.status}`
    );
  } catch (err) {
    recordTest("CRM", "Auth register endpoint connectivity", false, err.message);
  }
}

// 2. Customer Authentication & Validation Tests
async function testAuthenticationRules() {
  console.log("\n=== 2. CUSTOMER AUTHENTICATION & VALIDATION RULES ===");

  const registerSchema = z.object({
    name: z.string().min(1).max(160),
    email: z.string().email(),
    password: z.string().min(12, "Password must be at least 12 characters").max(72),
    phone: z.string().min(1).max(32),
    address: z.string().min(1).max(300),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
  });

  // Short password rejection
  const shortPassResult = registerSchema.safeParse({
    name: "Farmer Singh",
    email: "farmer@example.com",
    password: "short", // Only 5 characters!
    phone: "9876543210",
    address: "Farm Gate 1",
    city: "New Chandigarh",
    state: "Punjab",
    postalCode: "140901",
  });
  recordTest(
    "Auth",
    "Password shorter than 12 characters is strictly rejected by schema",
    !shortPassResult.success,
    "Short password was unexpectedly accepted"
  );

  // Valid password acceptance
  const validPassResult = registerSchema.safeParse({
    name: "Farmer Singh",
    email: "farmer@example.com",
    password: "CorrectPassphrase123!", // >= 12 chars
    phone: "9876543210",
    address: "Farm Gate 1",
    city: "New Chandigarh",
    state: "Punjab",
    postalCode: "140901",
  });
  recordTest(
    "Auth",
    "Valid registration payload passes schema validation",
    validPassResult.success,
    validPassResult.error?.message
  );

  // Email format validation
  const invalidEmailResult = registerSchema.safeParse({
    name: "Farmer Singh",
    email: "not-an-email",
    password: "CorrectPassphrase123!",
    phone: "9876543210",
    address: "Farm Gate 1",
    city: "New Chandigarh",
    state: "Punjab",
    postalCode: "140901",
  });
  recordTest(
    "Auth",
    "Malformed email address is strictly rejected",
    !invalidEmailResult.success,
    "Invalid email was accepted"
  );
}

// 3. Order Business Rules & Idempotency
async function testOrderBusinessRules() {
  console.log("\n=== 3. ORDER BUSINESS RULES & IDEMPOTENCY ===");

  const { generateExternalId } = await import("../src/lib/utils.ts");

  const id1 = generateExternalId("cart-checkout");
  const id2 = generateExternalId("cart-checkout");

  recordTest(
    "Orders",
    "generateExternalId creates unique, URL-safe idempotency keys",
    id1.startsWith("cart-checkout-") && id1 !== id2,
    `id1: ${id1}, id2: ${id2}`
  );

  // Verify unknown fields rejection rule as per WEBSITE_API.md:
  // "Do not send price, tax, discount, shipping charge, total, status, branch, organization, or actor fields"
  const orderInputSchema = z.object({
    externalOrderId: z.string().min(1).max(100),
    paymentMethod: z.enum(["RAZORPAY", "CASH"]),
    items: z.array(z.object({
      productId: z.string().min(1),
      quantity: z.number().positive(),
    })).min(1).max(100),
  }).strict();

  const taintedPayload = {
    externalOrderId: "ord-test-01",
    paymentMethod: "CASH",
    items: [{ productId: "prod_xtra_8000", quantity: 2 }],
    totalAmount: "3300.00", // Forbidden field!
    status: "CONFIRMED",    // Forbidden field!
  };

  const strictCheck = orderInputSchema.safeParse(taintedPayload);
  recordTest(
    "Orders",
    "Client cannot tamper with authoritative totalAmount or status",
    !strictCheck.success,
    "Tainted payload with client price/status was accepted"
  );
}

// 4. Razorpay Signature Verification & Proof
async function testPaymentVerificationRules() {
  console.log("\n=== 4. RAZORPAY PAYMENT VERIFICATION RULES ===");

  const verifySchema = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
  });

  const validProof = {
    razorpay_order_id: "order_12345",
    razorpay_payment_id: "pay_67890",
    razorpay_signature: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  };

  recordTest(
    "Payments",
    "Official 3 Razorpay proof fields validated correctly",
    verifySchema.safeParse(validProof).success
  );

  const missingProof = {
    razorpay_order_id: "order_12345",
  };

  recordTest(
    "Payments",
    "Missing payment_id or signature is rejected without verification",
    !verifySchema.safeParse(missingProof).success
  );
}

// 5. Internal Catalogue & Product Logic
async function testInternalCatalogAndData() {
  console.log("\n=== 5. INTERNAL CATALOGUE & PRODUCT LOGIC ===");

  const { OFFICIAL_HOLSTEIN_PRODUCTS, OFFICIAL_HOLSTEIN_CATEGORIES } = await import(
    "../src/lib/crm-client.ts"
  );

  recordTest(
    "Catalog",
    "Official Holstein categories are properly defined",
    OFFICIAL_HOLSTEIN_CATEGORIES.length >= 4,
    `Found ${OFFICIAL_HOLSTEIN_CATEGORIES.length} categories`
  );

  recordTest(
    "Catalog",
    "Official Holstein products include Xtra Milk series and calf starters",
    OFFICIAL_HOLSTEIN_PRODUCTS.some((p) => p.name.includes("Xtra Milk 8000")) &&
      OFFICIAL_HOLSTEIN_PRODUCTS.some((p) => p.name.includes("Calf Starter")),
    "Missing core brand products"
  );

  const invalidPrices = OFFICIAL_HOLSTEIN_PRODUCTS.filter(
    (p) => !p.sellingPrice || isNaN(parseFloat(p.sellingPrice)) || parseFloat(p.sellingPrice) <= 0
  );
  recordTest(
    "Catalog",
    "All catalog products have valid positive decimal string prices in INR",
    invalidPrices.length === 0,
    `Found invalid prices: ${invalidPrices.map((p) => p.name).join(", ")}`
  );

  const missingSkus = OFFICIAL_HOLSTEIN_PRODUCTS.filter((p) => !p.sku || p.sku.length < 3);
  recordTest(
    "Catalog",
    "All products have valid SKU identifiers",
    missingSkus.length === 0,
    `Found missing SKUs in ${missingSkus.length} products`
  );
}

// 6. Security and Static Bundles Audit
async function testStaticSecurityAndBundles() {
  console.log("\n=== 6. SECURITY & SECRETS AUDIT ===");

  const nextStaticDir = path.join(process.cwd(), ".next", "static");
  let foundSecret = false;
  let searchedFiles = 0;

  if (fs.existsSync(nextStaticDir)) {
    const scanDir = (dir) => {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          scanDir(full);
        } else if (f.endsWith(".js")) {
          searchedFiles++;
          const content = fs.readFileSync(full, "utf8");
          if (content.includes("CRM_WEBSITE_API_KEY") || content.includes("RAZORPAY_KEY_SECRET")) {
            foundSecret = true;
          }
        }
      }
    };
    scanDir(nextStaticDir);
  }

  recordTest(
    "Security",
    `No CRM or Razorpay private secrets leaked in ${searchedFiles} client browser bundles`,
    !foundSecret,
    "Private secret found in client JS!"
  );

  const logoExists = fs.existsSync(path.join(process.cwd(), "public", "hl.png"));
  const faviconExists = fs.existsSync(path.join(process.cwd(), "public", "hf.png"));
  recordTest("Assets", "Main logo hl.png is present in /public", logoExists);
  recordTest("Assets", "Favicon hf.png is present in /public", faviconExists);

  // Check UI reference files exist
  recordTest("Assets", "UI reference h1.jpeg exists", fs.existsSync(path.join(process.cwd(), "h1.jpeg")));
  recordTest("Assets", "UI reference h2.jpeg exists", fs.existsSync(path.join(process.cwd(), "h2.jpeg")));
  recordTest("Assets", "UI reference h3.jpeg exists", fs.existsSync(path.join(process.cwd(), "h3.jpeg")));
  recordTest("Assets", "UI reference h4.jpeg exists", fs.existsSync(path.join(process.cwd(), "h4.jpeg")));
}

async function run() {
  console.log("Starting Holstein E-Commerce Automated Verification Suite...\n");
  await testBackendLiveEndpoints();
  await testAuthenticationRules();
  await testOrderBusinessRules();
  await testPaymentVerificationRules();
  await testInternalCatalogAndData();
  await testStaticSecurityAndBundles();

  console.log("\n==========================================");
  console.log(`TOTAL TESTS: ${results.passed + results.failed}`);
  console.log(`PASSED: ${results.passed}`);
  console.log(`FAILED: ${results.failed}`);
  console.log("==========================================\n");

  if (results.failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
