import { cookies } from "next/headers";

export const CUSTOMER_SESSION_COOKIE = "holstein_customer_session";
export const CUSTOMER_DATA_COOKIE = "holstein_customer_data";

// 8 hours as per CUSTOMER_AUTH_API.md
const SESSION_MAX_AGE = 8 * 60 * 60;

export async function setCustomerSessionCookies(
  token: string,
  account: { customerId: string; externalCustomerId: string; email: string; name: string },
  expiresAt?: string
) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // Secure HttpOnly session token cookie
  cookieStore.set({
    name: CUSTOMER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Client-readable non-sensitive account metadata (for UI header/name display)
  cookieStore.set({
    name: CUSTOMER_DATA_COOKIE,
    value: JSON.stringify(account),
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getCustomerSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
}

export async function getCustomerAccountData(): Promise<{
  customerId: string;
  externalCustomerId: string;
  email: string;
  name: string;
} | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CUSTOMER_DATA_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearCustomerSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  cookieStore.delete(CUSTOMER_DATA_COOKIE);
}

