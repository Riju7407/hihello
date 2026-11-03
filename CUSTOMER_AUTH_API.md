# Customer authentication API — published URLs

Published API base: **https://holstein-main.vercel.app/api/v1/website/auth**

See the [published API availability note](WEBSITE_API.md#holstein-website-api--published-urls).

The API provides website shopper registration, login, current account, logout and password change. Existing employee/admin user creation and login remain available through the normal Users screen and `https://holstein-main.vercel.app/api/v1/auth/*` APIs.

## Endpoints

| Method | Published URL                                                          | Customer session |
| ------ | ---------------------------------------------------------------------- | ---------------- |
| POST   | `https://holstein-main.vercel.app/api/v1/website/auth/register`        | No               |
| POST   | `https://holstein-main.vercel.app/api/v1/website/auth/login`           | No               |
| GET    | `https://holstein-main.vercel.app/api/v1/website/auth/me`              | Yes              |
| POST   | `https://holstein-main.vercel.app/api/v1/website/auth/logout`          | Yes              |
| POST   | `https://holstein-main.vercel.app/api/v1/website/auth/change-password` | Yes              |

## Website server calls

All calls below use `Authorization: Bearer <WEBSITE_API_KEY>` and JSON bodies through the website's backend. Do not expose the integration secret to browsers. For protected calls the website server additionally forwards `x-customer-session: <customer token>` from its authenticated shopper session.

POST `https://holstein-main.vercel.app/api/v1/website/auth/register`:

```json
{
  "name": "Example Customer",
  "email": "buyer@example.com",
  "password": "Example passphrase 123!",
  "phone": "9000000000",
  "address": "12 Example Street",
  "city": "Delhi",
  "state": "Delhi",
  "postalCode": "110001"
}
```

`externalCustomerId` is optional; the CRM generates it when omitted. If supplied it must be unique within the website organization. Email is normalized to lowercase and unique per organization/website. Passwords require at least 12 characters and no more than 72 UTF-8 bytes. Customer, credentials and the first session are created atomically. Passwords are bcrypt-hashed; plaintext is never saved in the customer record or request fingerprint. Signup grants no staff roles.

POST `https://holstein-main.vercel.app/api/v1/website/auth/login`:

```json
{ "email": "buyer@example.com", "password": "Example passphrase 123!" }
```

Registration returns HTTP 201 and login returns HTTP 200, with:

```json
{
  "success": true,
  "data": {
    "account": {
      "customerId": "<CRM customer ID>",
      "externalCustomerId": "<website customer reference>",
      "email": "buyer@example.com",
      "name": "Example Customer"
    },
    "token": "wc_<opaque random session token>",
    "expiresAt": "<ISO timestamp>"
  }
}
```

Store the customer token in the website's secure HttpOnly session/cookie; use its usual CSRF protection. Customer sessions expire after eight hours. The CRM stores only a token hash. Five failed passwords lock an account for 15 minutes, with row locking so concurrent failures cannot skip the counter. Invalid login responses do not distinguish unknown email, disabled customer or wrong password.

GET `https://holstein-main.vercel.app/api/v1/website/auth/me` returns the current customer identity. POST `https://holstein-main.vercel.app/api/v1/website/auth/logout` revokes the current session. POST `https://holstein-main.vercel.app/api/v1/website/auth/change-password` requires:

```json
{ "currentPassword": "Example passphrase 123!", "newPassword": "A different passphrase 456!" }
```

A password change revokes every session for that website customer and requires a new login. Profile email changes are contact updates; they do not silently change the login email. Automated email verification/password-reset delivery is not added by these endpoints.

## Account and order ownership

The customer session is required for customer GET/PATCH, order create/list/detail, checkout, and payment verification. The existing `externalCustomerId` field/query must equal the session's customer reference; changing it to another shopper fails. Organization, integration, branch, active customer state, expiry and revocation are checked on each protected call. Staff session tokens cannot be used as shopper sessions, and shopper tokens grant no admin API access.

The catalogue remains available to the website backend before shoppers log in. The trusted `POST https://holstein-main.vercel.app/api/v1/website/customers` synchronization endpoint can still create customer records without credentials; it does not enroll those customers for login. Registration never attaches a new password to a pre-existing external reference or claims records by matching a phone/email. Duplicate registration returns 409; an existing registered shopper should log in.

See [WEBSITE_API.md](WEBSITE_API.md) for order/catalogue payloads and [PAYMENTS_API.md](PAYMENTS_API.md) for payment configuration. A website developer must connect the website's signup/login forms to these server endpoints; this repository does not contain the external site's frontend.
