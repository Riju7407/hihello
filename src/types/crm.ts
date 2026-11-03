// Types corresponding directly to WEBSITE_API.md, CUSTOMER_AUTH_API.md, and PAYMENTS_API.md

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  sku: string;
  name: string;
  unit: string;
  sellingPrice: string; // Decimal string as per WEBSITE_API.md e.g. "1250.00"
  currency: "INR";
  quantityOnHand?: number;
  description?: string | null;
  packSizeLabel?: string | null;
  tag?: string | null;
  productDetails?: Record<string, unknown> | null;
  imageUrls?: string[] | null;
  sourceUrl?: string | null;
  isActive: boolean;
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CustomerAccount {
  customerId: string;
  externalCustomerId: string;
  email: string;
  name: string;
}

export interface AuthSessionData {
  account: CustomerAccount;
  token: string;
  expiresAt: string;
}

export interface CustomerProfile {
  customerId?: string;
  externalCustomerId: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string; // Must be "IN"
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  externalOrderId: string;
  externalCustomerId: string;
  paymentMethod: "RAZORPAY" | "CASH";
  shippingAddress: ShippingAddress;
  items: OrderItemInput[];
  notes?: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  sku?: string;
  unit?: string;
  quantity: number;
  unitPrice?: string;
  totalPrice?: string;
}

export type OrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "INITIALIZING"
  | "READY"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "REVIEW_REQUIRED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export interface Order {
  id?: string;
  externalOrderId: string;
  externalCustomerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "RAZORPAY" | "CASH";
  currency: "INR";
  totalAmount?: string; // Decimal string formatted total
  totalAmountPaise?: number; // Integer paise
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RazorpayCheckoutInitResponse {
  keyId: string;
  orderId: string;
  amount: number; // In paise
  currency: "INR";
  paymentId: string;
  status: PaymentStatus;
}

export interface RazorpayVerifyPayload {
  externalCustomerId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerifyResponse {
  status: PaymentStatus;
  amountPaise: number;
  currency: "INR";
}

