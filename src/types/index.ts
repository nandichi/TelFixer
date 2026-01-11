// User Types
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

// Product Types
export type ConditionGrade = 'als_nieuw' | 'zeer_goed' | 'goed' | 'sterk_gebruikt';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  brand: string;
  price: number;
  original_price: number | null;
  condition_grade: ConditionGrade;
  description: string;
  specifications: Record<string, string>;
  stock_quantity: number;
  image_urls: string[];
  warranty_months: number;
  featured: boolean;
  marketplace_url: string | null;
  facebook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ConditionGrade[];
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  page?: number;
  limit?: number;
}

// Device Submission Types
export type SubmissionStatus = 
  | 'ontvangen'
  | 'evaluatie'
  | 'aanbieding_gemaakt'
  | 'aanbieding_geaccepteerd'
  | 'aanbieding_afgewezen'
  | 'afgehandeld';

export interface DeviceSubmission {
  id: string;
  reference_number: string;
  user_id: string | null;
  device_type: string;
  device_brand: string;
  device_model: string;
  condition_description: string;
  photos_urls: string[];
  status: SubmissionStatus;
  evaluation_notes: string | null;
  offered_price: number | null;
  offer_accepted: boolean | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  updated_at: string;
}

// Order Types
export type OrderStatus = 
  | 'in_behandeling'
  | 'betaald'
  | 'verzonden'
  | 'afgeleverd'
  | 'geannuleerd';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user?: User;
  total_price: number;
  shipping_cost: number;
  tax: number;
  status: OrderStatus;
  shipping_address: Address;
  billing_address: Address;
  payment_status: PaymentStatus;
  payment_method: string;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Admin Types
export interface Admin {
  id: string;
  email: string;
  role: 'admin' | 'support';
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface SubmissionFormData {
  device_type: string;
  device_brand: string;
  device_model: string;
  condition_description: string;
  photos: File[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  terms_accepted: boolean;
}

export interface CheckoutFormData {
  shipping_address: Omit<Address, 'id' | 'user_id' | 'is_default' | 'created_at'>;
  billing_same_as_shipping: boolean;
  billing_address?: Omit<Address, 'id' | 'user_id' | 'is_default' | 'created_at'>;
  payment_method: string;
}
