# Holstein website API — published URLs

Published origin: **https://holstein-main.vercel.app**

Website API base: **https://holstein-main.vercel.app/api/v1/website**

Deployment check (2026-11-01): the published health API returned HTTP 200, but the website products API returned HTTP 404. These documents describe the implemented API contracts at the published origin; availability of the new commerce routes on the hosted release still needs verification.

Related API files: [Customer authentication](CUSTOMER_AUTH_API.md), [Payments](PAYMENTS_API.md).

## Architecture and authentication

Use `https://holstein-main.vercel.app` as `CRM_BASE_URL`. Endpoint URLs below include the published origin.

The website must have a server/backend-for-frontend (BFF). Its authenticated server calls `https://holstein-main.vercel.app/api/v1/website/*` with:

```http
Authorization: Bearer <WEBSITE_API_KEY>
Content-Type: application/json
```

Never put the integration key, Razorpay key secret, or CRM admin credentials in browser JavaScript, public environment variables, mobile builds, URLs, or logs. Only Razorpay's public key ID is returned to checkout clients. There is deliberately no browser cross-origin credential/CORS wildcard support.

The CRM checks a dedicated active service user, `WEBSITE_API:ACCESS`, the operation permission, and its saved organization/active branch on every request. Configure the connection in **Organization → Website connection**; organization, branch and service-user IDs are no longer environment variables. Request bodies cannot choose another organization, branch, actor, price, order status, or assignee. The current adapter supports one saved website/organization/branch per deployment.

Customer registration and login are provided by `https://holstein-main.vercel.app/api/v1/website/auth/*`, described below. The website server stores the returned customer token in its secure HttpOnly session and forwards it to account/order endpoints as `x-customer-session`. The CRM verifies the session and customer reference on every protected request. The website remains responsible for its own CSRF/session-cookie protection and ingress rate limits. An integration key and a customer session serve different purposes; the integration key stays on the website server.

Responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code", "message", "requestId" } }`. Sensitive website responses have `Cache-Control: no-store`. JSON bodies are limited to 64 KiB.

## Endpoints

| Method | Path                                                                                              | Purpose / additional service-user permission                 |
| ------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| GET    | `https://holstein-main.vercel.app/api/v1/website/categories`                                      | Active categories; `PRODUCT:VIEW`                            |
| GET    | `https://holstein-main.vercel.app/api/v1/website/products`                                        | Active, priced products in active categories; `PRODUCT:VIEW` |
| POST   | `https://holstein-main.vercel.app/api/v1/website/customers`                                       | Idempotent website customer registration; `SALES:CREATE`     |
| GET    | `https://holstein-main.vercel.app/api/v1/website/customers/{externalCustomerId}`                  | Website-mapped customer; `SALES:VIEW`                        |
| PATCH  | `https://holstein-main.vercel.app/api/v1/website/customers/{externalCustomerId}`                  | Contact/address update; `SALES:UPDATE`                       |
| POST   | `https://holstein-main.vercel.app/api/v1/website/orders`                                          | Atomic CRM order + payment registration; `SALES:CREATE`      |
| GET    | `https://holstein-main.vercel.app/api/v1/website/orders?externalCustomerId=...`                   | This website customer's orders; `SALES:VIEW`                 |
| GET    | `https://holstein-main.vercel.app/api/v1/website/orders/{externalOrderId}?externalCustomerId=...` | Owned order/payment status; `SALES:VIEW`                     |
| POST   | `https://holstein-main.vercel.app/api/v1/website/orders/{externalOrderId}/checkout`               | Initialize/reuse Razorpay order; `SALES:CREATE`              |
| POST   | `https://holstein-main.vercel.app/api/v1/website/orders/{externalOrderId}/verify`                 | Verify checkout proof and provider state; `SALES:UPDATE`     |

Catalogue lists accept `page` (default 1), `pageSize` (default 20, max 100), and `search` (max 100 characters). Customer order lists accept `externalCustomerId`, `page`, and `pageSize`. Lists return `{items,total,page,pageSize}`. Products include category, SKU, description, unit, pack label, details, image URLs, decimal-string `sellingPrice`, `currency: "INR"`, and configured-branch `quantityOnHand`. Inactive/unpriced products imported earlier remain excluded until activated and priced.

### 1. Register or log in a website customer

POST `https://holstein-main.vercel.app/api/v1/website/auth/register` with the customer fields shown below **plus** `password`. Email is required for registration; `externalCustomerId` is optional (generated if omitted). Passwords require at least 12 characters and at most 72 UTF-8 bytes. The CRM creates a customer, separate website credential and session atomically, with no staff identity or role grants.

POST `https://holstein-main.vercel.app/api/v1/website/auth/login` with `{ "email": "buyer@example.com", "password": "<password>" }`. Both endpoints return `{ account: { customerId, externalCustomerId, email, name }, token, expiresAt }`. Sessions last eight hours; only their hashes are stored. After five wrong passwords the account is locked for 15 minutes.

Forward the returned token as `x-customer-session` on customer detail/update, order create/list/detail, checkout and verification requests. Continue sending `Authorization: Bearer <WEBSITE_API_KEY>` from the website backend. Caller-supplied customer references must match the session, otherwise the CRM rejects them.

- GET `https://holstein-main.vercel.app/api/v1/website/auth/me`: current customer identity.
- POST `https://holstein-main.vercel.app/api/v1/website/auth/logout`: revoke the current customer session.
- POST `https://holstein-main.vercel.app/api/v1/website/auth/change-password`: `{ "currentPassword": "...", "newPassword": "..." }`; revokes all customer sessions, then the shopper logs in again.

Shopper tokens cannot log in to the staff/admin API. Neither staff nor customer sessions need a JWT secret. Existing staff user creation, login, password reset, roles and branch permissions are preserved.

### Optional customer creation without a login

POST `https://holstein-main.vercel.app/api/v1/website/customers` remains available for trusted back-office customer synchronization. It uses the following payload and does not issue a login. Use `/auth/register` for a shopper who needs to place orders. A pre-existing reference cannot be claimed by registering another password against it.

```json
{
  "externalCustomerId": "shopper-1001",
  "name": "Example Customer",
  "phone": "9000000000",
  "email": "buyer@example.com",
  "address": "Example Street 12",
  "city": "Delhi",
  "state": "Delhi",
  "postalCode": "110001"
}
```

`email` is optional; other example fields are required. IDs are 1–100 characters using letters, digits, `_`, `.`, `:`, or `-`. Names are max 160, phone max 32, address max 300, city/state max 100, postal code max 20. No automatic matching by phone/email occurs: this avoids linking someone to another customer's records. Reusing the same external ID and original payload returns the existing customer. Changed payload returns 409; use PATCH with changed contact/address fields instead. A later replay of the original registration returns the current customer, without overwriting PATCH updates.

### 2. Create an order

```json
{
  "externalOrderId": "cart-checkout-1001",
  "externalCustomerId": "shopper-1001",
  "paymentMethod": "RAZORPAY",
  "shippingAddress": {
    "name": "Example Customer",
    "phone": "9000000000",
    "address": "Example Street 12",
    "city": "Delhi",
    "state": "Delhi",
    "postalCode": "110001",
    "country": "IN"
  },
  "items": [{ "productId": "<CRM product ID>", "quantity": 1 }],
  "notes": "Optional delivery instructions"
}
```

Use `CASH` for cash-on-delivery/manual collection. Razorpay orders require enabled credentials. India/INR only. There must be 1–100 distinct products; combine duplicate product lines. Quantity is positive, max 999999, and supports three decimal places. Notes max 3000 characters. Do not send price, tax, discount, shipping charge, total, status, branch, organization, or actor fields; unknown fields fail validation.

The CRM snapshots current catalogue prices using exact Decimal arithmetic and computes line totals rounded to two decimals. The payment amount is integer paise, positive, and no greater than 2,147,483,647 paise. The returned total—not a website calculation—is authoritative. There is no new shipping/tax/discount calculation engine; do not advertise fees that are absent from this total.

`externalOrderId` is the idempotency key. Persist it before the first call, and reuse it with the same payload after a timeout. Identical retries (including concurrent unique-key races) return the same order; changing the payload with that ID returns 409. Do not generate a new ID merely because a payment or network call failed.

The order starts as `DRAFT`, with a `PENDING` payment. The full shipping address is saved as an immutable snapshot, independent of future customer edits. Initial stock availability is checked, but draft checkout does **not reserve stock**. Staff accept/confirm orders using the existing stock-deduction workflow. Competing drafts may exhaust stock before acceptance; staff must resolve this, including refund handling if already paid. Payment capture does not automatically accept or fulfil orders.

### 3. Cash checkout

For `CASH`, show the created order confirmation as **cash due**, not paid. Staff with collection permission record the full actual cash receipt in Sales CRM → Cash Payments. The API never treats a shopper's cash-selection claim as proof of receipt.

### 4. Razorpay checkout

POST `https://holstein-main.vercel.app/api/v1/website/orders/cart-checkout-1001/checkout`:

```json
{ "externalCustomerId": "shopper-1001" }
```

`data` contains `{keyId,orderId,amount,currency,paymentId,status}`. These are checkout-safe identifiers and amounts, not secrets. The website passes `keyId` as Razorpay Checkout's `key`, `orderId` as `order_id`, and the returned `amount`/`currency` to the official checkout SDK. Display the authoritative amount before the shopper confirms payment.

After the SDK callback, the website server forwards proof to `/verify`:

```json
{
  "externalCustomerId": "shopper-1001",
  "razorpay_order_id": "order_example",
  "razorpay_payment_id": "pay_example",
  "razorpay_signature": "<64-character hex signature>"
}
```

The CRM verifies the signature using its stored provider order ID and RAZORPAY_KEY_SECRET, fetches payment state directly from Razorpay, and compares order ID, amount, and currency. Only a captured payment becomes `PAID`; `AUTHORIZED` is not paid. The verification response contains status, amount in paise, and currency. If the checkout callback is missed, staff use Sales CRM → Razorpay Payments → Reconcile to fetch the provider result. Re-fetch the owned order after reconciliation; never mark paid using browser callback data alone. There are no webhook or background payment updates.

Provider order creation is claimed once in the database. Ambiguous timeouts enter `REVIEW_REQUIRED`; concurrent initialization returns 409. Do not retry with a fresh CRM/external order to bypass that state. See the recovery procedure in [PAYMENTS_API.md](PAYMENTS_API.md).

### Website backend example

```ts
// Server-only module in YOUR website, not a client component.
async function crmRequest(path: string, body?: unknown, customerToken?: string) {
  const response = await fetch(`https://holstein-main.vercel.app/api/v1/website${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${process.env.CRM_WEBSITE_API_KEY}`,
      "Content-Type": "application/json",
      ...(customerToken ? { "x-customer-session": customerToken } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message ?? "CRM request failed");
  return result.data;
}
// externalCustomerId must come from your authenticated server session.
// Forward that session's customerToken on all protected account/order calls.
// Persist externalOrderId and the checkout payload before POST /orders.
```

The website's `CRM_WEBSITE_API_KEY` value must match CRM `WEBSITE_API_KEY`. The website integration itself is not deployed by this repository change; wire its server routes using these contracts.

## Existing administrative APIs remain available

These endpoints use the existing CRM login session/Bearer access token and role/branch checks, **not** `WEBSITE_API_KEY`. There is no need to duplicate backend catalogue/customer functionality. Normal website users should only use the narrower website adapter above.

| Resource   | List/create                                                            | Detail/update                                                            | Permissions                |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------- |
| Categories | GET/POST `https://holstein-main.vercel.app/api/v1/products/categories` | PATCH `https://holstein-main.vercel.app/api/v1/products/categories/{id}` | PRODUCT:VIEW/CREATE/UPDATE |
| Products   | GET/POST `https://holstein-main.vercel.app/api/v1/products`            | GET/PATCH `https://holstein-main.vercel.app/api/v1/products/{id}`        | PRODUCT:VIEW/CREATE/UPDATE |
| Customers  | GET/POST `https://holstein-main.vercel.app/api/v1/customers`           | GET/PATCH `https://holstein-main.vercel.app/api/v1/customers/{id}`       | SALES:VIEW/CREATE/UPDATE   |
| Orders     | GET/POST `https://holstein-main.vercel.app/api/v1/orders`              | GET/PATCH `https://holstein-main.vercel.app/api/v1/orders/{id}`          | SALES:VIEW/CREATE/UPDATE   |
| Inventory  | GET `https://holstein-main.vercel.app/api/v1/inventory`                | POST `https://holstein-main.vercel.app/api/v1/inventory/adjustments`     | INVENTORY:VIEW/ADJUST      |

Category creation fields: `code`, `name`, optional `description`, `isActive`. Product fields: `categoryId`, `sku`, `name`, `unit`, `sellingPrice`, optional `description`, `packSizeLabel`, `tag`, `productDetails`, `imageUrls` (HTTPS, max 8), `sourceUrl` (HTTPS), `isActive`. Codes/SKUs use uppercase letters/digits/hyphens/underscores, length 2–64. Prices are nonnegative numbers with up to two decimals. Set `isActive: false` for retirement; no new hard-delete APIs were added. Existing full schemas remain in `src/lib/rbac-schemas.ts`.

Customer creation requires `branchId`, `name`, and `address`; supports existing contact/company/assignee/status fields. Order creation uses `customerId`, `orderDate` (`YYYY-MM-DD`), `items: [{productId,quantity,notes?}]`, optional `status`/`notes`. Order PATCH retains existing date/status/notes behavior. Items become immutable once payment is registered. Razorpay-linked orders cannot enter `PROCESSING`/`COMPLETED` without verified `PAID` status. No change to legacy orders without payments.

## Errors and retry behavior

| HTTP | Meaning                                                                                 |
| ---- | --------------------------------------------------------------------------------------- |
| 400  | Malformed JSON, wrong content type, missing customer reference                          |
| 401  | Wrong website token or payment signature                                                |
| 403  | Service account/permission/branch access denied                                         |
| 404  | Customer/order/payment outside scope or absent                                          |
| 409  | Conflicting idempotency key, in-progress checkout, provider mismatch, recovery required |
| 413  | Body exceeds limit                                                                      |
| 422  | Invalid fields, unavailable products, stock or amount validation                        |
| 502  | Provider unavailable/rejected call; reconcile ambiguous checkout initialization         |
| 503  | Integration/payment not configured or live payments not activated                       |

Keep the response request ID for diagnostics, not secrets or raw payment data. Network retries must preserve external IDs and payloads. Disable double-clicks on the website, but rely on server idempotency rather than UI controls for correctness.
