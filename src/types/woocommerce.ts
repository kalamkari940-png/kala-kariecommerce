export interface WooImage {
  id: number;
  src: string;
  name?: string;
  alt?: string;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: WooImage;
  count?: number;
}

export interface WooProductAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface WooProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price?: string;
  on_sale: boolean;
  attributes: { name: string; option: string }[];
  stock_quantity: number;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  type?: string;
  status?: string;
  featured?: boolean;
  catalog_visibility?: string;
  description: string;
  short_description?: string;
  sku?: string;
  price: number;
  regular_price: number;
  sale_price?: number;
  on_sale?: boolean;
  purchasable?: boolean;
  total_sales?: number;
  stock_quantity?: number;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  categories: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
  images: WooImage[];
  attributes?: WooProductAttribute[];
  variations?: number[];
  rating_count?: number;
  average_rating?: string;
  // Extended UI helper properties
  category?: string;
  image?: string;
  gallery?: string[];
  fabric?: string;
  craft?: string;
  motive?: string;
  sizes?: string[];
  newArrival?: boolean;
  bestSeller?: boolean;
  readyToShip?: boolean;
}

export interface WooCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  sku?: string;
  price: string;
  line_total: string;
  size?: string;
  color?: string;
  product: WooProduct;
}

export interface WooCart {
  items: WooCartItem[];
  item_count: number;
  total_price: number;
  subtotal: number;
  coupons?: { code: string; discount: string }[];
}

export interface WooAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WooOrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id?: number;
  quantity: number;
  tax_class?: string;
  subtotal: string;
  total: string;
  sku?: string;
  price: number;
}

export interface WooOrder {
  id: number;
  parent_id?: number;
  number: string;
  order_key?: string;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';
  currency?: string;
  date_created: string;
  total: string;
  total_tax?: string;
  shipping_total?: string;
  customer_id: number;
  billing: WooAddress;
  shipping: WooAddress;
  payment_method?: string;
  payment_method_title?: string;
  line_items: WooOrderLineItem[];
  customer_note?: string;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  username: string;
  billing?: WooAddress;
  shipping?: WooAddress;
  avatar_url?: string;
}

export interface WooReview {
  id: number;
  date_created: string;
  product_id: number;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
}
