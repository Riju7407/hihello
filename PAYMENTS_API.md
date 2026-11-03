# Payments API — published URLs

Published origin: **https://holstein-main.vercel.app**

Website checkout base: **https://holstein-main.vercel.app/api/v1/website/orders**

Staff commerce base: **https://holstein-main.vercel.app/api/v1/commerce**

See the [published API availability note](WEBSITE_API.md#holstein-website-api--published-urls).

## Website checkout API

Call through the website backend using `Authorization: Bearer <WEBSITE_API_KEY>`, `x-customer-session: <shopper token>` and `Content-Type: application/json`. The logged-in customer must own the order. Never expose the integration key or Razorpay API secret to browsers.

| Method | Published URL                                                                       | Service permission |
| ------ | ----------------------------------------------------------------------------------- | ------------------ |
| POST   | `https://holstein-main.vercel.app/api/v1/website/orders/{externalOrderId}/checkout` | SALES:CREATE       |
| POST   | `https://holstein-main.vercel.app/api/v1/website/orders/{externalOrderId}/verify`   | SALES:UPDATE       |

The active integration user also needs WEBSITE_API:ACCESS and branch access. Substitute URL-encoded identifiers for the placeholders.

### Initialize checkout

POST `https://holstein-main.vercel.app/api/v1/website/orders/checkout-1001/checkout`

```json
{ "externalCustomerId": "shopper-1001" }
```

The standard success envelope contains `data: { keyId, orderId, amount, currency, paymentId, status }`. The amount is integer paise and comes from the CRM order total. Pass `keyId` as `key`, `orderId` as `order_id`, and the returned amount/currency to the official SDK at `https://checkout.razorpay.com/v1/checkout.js`. Only the public key ID is checkout-safe; never send the API secret.

An initialized provider order is reused. Concurrent initialization returns 409; ambiguous initialization can enter REVIEW_REQUIRED. Do not create a second CRM/external order to bypass uncertainty.

### Verify the actual SDK callback

POST `https://holstein-main.vercel.app/api/v1/website/orders/checkout-1001/verify`

```json
{
  "externalCustomerId": "shopper-1001",
  "razorpay_order_id": "<provider order ID from SDK>",
  "razorpay_payment_id": "<provider payment ID from SDK>",
  "razorpay_signature": "<64-character hexadecimal signature from SDK>"
}
```

The CRM verifies the HMAC and fetches canonical provider state, matching order ID, amount and currency. It returns `data: { status, amountPaise, currency }`. Only captured payment becomes PAID; AUTHORIZED is not paid. Never fabricate proof or accept a browser success message as paid. Duplicate verification is idempotent; tampered proof returns 401.

Re-fetch the owned order at `https://holstein-main.vercel.app/api/v1/website/orders/checkout-1001?externalCustomerId=shopper-1001` with both website authentication headers. Missed callbacks or later captures/refunds require staff reconciliation; there are no background/webhook updates.

Customer sessions: [CUSTOMER_AUTH_API.md](CUSTOMER_AUTH_API.md). Order creation, responses and errors: [WEBSITE_API.md](WEBSITE_API.md).

## Payment verification without webhooks

After Razorpay Checkout returns its three proof fields, the CRM verifies the HMAC signature using RAZORPAY_KEY_SECRET and the stored provider order ID. It then fetches canonical payment state directly from Razorpay using the API key ID and secret, checking order ID, amount and currency before updating the ledger. A browser success message alone does not mark an order paid.

If the callback is missed or a payment is captured/refunded later, authorized staff use **Sales CRM → Razorpay Payments → Reconcile**. This fetches payment attempts for the stored Razorpay order and updates the local status and refund amount. Payment and refund states do not update automatically in the background.

Webhook processing has been retired. POST `https://holstein-main.vercel.app/api/v1/webhooks/razorpay` returns HTTP 410 and never changes payment data. No webhook secret is read or required. Remove any existing Razorpay dashboard webhook subscription pointing to this endpoint to stop obsolete delivery attempts.

A payment records its original key ID; switching test/live accounts without reconciling old payments is deliberately rejected. Multi-account historical key management is not implemented.

## Staff commerce API

All routes below require normal CRM authentication, organization/branch scope, and the listed permission. Search, pagination and payment-status filters are supported on the list endpoints (`page`, `pageSize`, `search`, `status`, optional `branchId`).

| Method / path                                                                          | Permission                 | Purpose                                                    |
| -------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| GET `https://holstein-main.vercel.app/api/v1/commerce/website-orders`                  | WEBSITE_ORDER:VIEW         | Website orders, items, shipping snapshot and payment state |
| GET `https://holstein-main.vercel.app/api/v1/commerce/cash`                            | CASH_PAYMENT:VIEW          | Cash ledger                                                |
| GET `https://holstein-main.vercel.app/api/v1/commerce/razorpay`                        | RAZORPAY_PAYMENT:VIEW      | Razorpay ledger                                            |
| POST `https://holstein-main.vercel.app/api/v1/commerce/payments`                       | PAYMENT:CREATE             | Attach payment method to existing CRM order                |
| POST `https://holstein-main.vercel.app/api/v1/commerce/cash/{paymentId}/collect`       | CASH_PAYMENT:COLLECT       | Record full cash receipt                                   |
| POST `https://holstein-main.vercel.app/api/v1/commerce/razorpay/{paymentId}/checkout`  | RAZORPAY_PAYMENT:CREATE    | Initialize/reuse secure checkout                           |
| POST `https://holstein-main.vercel.app/api/v1/commerce/razorpay/{paymentId}/verify`    | RAZORPAY_PAYMENT:CREATE    | Verify checkout callback                                   |
| POST `https://holstein-main.vercel.app/api/v1/commerce/razorpay/{paymentId}/reconcile` | RAZORPAY_PAYMENT:RECONCILE | Fetch provider state/recover initialization                |

Website orders register payments automatically. For existing CRM orders, use the order detail's Payment registration section:

```json
{ "orderId": "<CRM order ID>", "method": "CASH" }
```

`method` may also be `RAZORPAY`. Registration is idempotent per order/method; switching method on an existing payment returns 409. Historical payments are not fabricated/backfilled. Item totals cannot change after registration. Legacy/unpriced orders must be priced before registration.

Cash receipt request:

```json
{ "amountPaise": 125000, "reference": "CASH-RECEIPT-2026-001" }
```

The amount must match the complete stored total. Record only money actually received; split/partial cash payments are not implemented. Receipt reference is required (max 160). An identical receipt retry is harmless; a different reference for an already-paid order returns 409. The actor, timestamp, and event are retained. No cash collection is accepted for cancelled orders.

The Razorpay tab includes an explicit **Open checkout** action for permitted users. It loads the official checkout SDK only when requested. It does not charge by merely viewing a tab or registering a payment. The customer must authorize payment in Razorpay. Checkout verification accepts the three `razorpay_*` proof fields described in the website API guide, without `externalCustomerId` for this authenticated admin route.

Reconcile uses `{}` when a provider order is already linked. It fetches all payment attempts for that order; this is read-only at Razorpay and may update the local ledger. It never initiates a charge or refund.

## Ambiguous initialization / recovery

1. A database claim changes `PENDING` to `INITIALIZING` before making the provider request. Only one caller wins; others receive 409.
2. A successful provider response stores its order ID and changes status to `READY`.
3. A timeout/ambiguous failure becomes `REVIEW_REQUIRED`. A process interruption can leave `INITIALIZING`. Neither state automatically creates another provider order.
4. Find the provider order in Razorpay whose **receipt exactly equals the local payment ID**. Reconcile with `{ "providerOrderId": "order_..." }`. The CRM verifies receipt, amount and currency against Razorpay before linking it.
5. If no provider order exists, do not invent an ID or create a second order blindly. Investigate with provider support/operator tooling before resetting the initialization claim. This implementation intentionally has no unsafe reset/retry button.

## Order, inventory, cancellation and refunds

Payment state and fulfilment state are separate. Website orders start as drafts; stock is checked but not reserved until the normal confirmation flow deducts it. Paid drafts need staff acceptance and stock review. Razorpay payment must be `PAID` before processing/completion. Paid status is not proof of bank settlement; settlement/payout/dispute accounting is outside this integration.

Cancellation does not initiate a refund or automatically reverse existing stock deductions. Use the existing audited inventory-adjustment workflow and the Razorpay dashboard/operator process where required. Refunds initiated in Razorpay are reflected after reconciliation as `PARTIALLY_REFUNDED` or `REFUNDED`; no refund-creation endpoint is added. If a payment arrives after cancellation, staff reconcile it to record the received money and arrange a refund where required. Cash refunds are not automated.

## Supported payment states

PENDING, INITIALIZING, READY, AUTHORIZED, PAID, FAILED, REVIEW_REQUIRED, PARTIALLY_REFUNDED, REFUNDED.

Common errors: 401 invalid authentication/signature, 403 permission denied, 404 missing/out-of-scope record, 409 conflict/recovery, 422 invalid amount/state, 502 provider error and 503 unavailable configuration. The website integration key and shopper session do not grant staff commerce permissions.
