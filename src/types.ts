export interface Brand { id: number; name: string; slug: string; }
export interface Category { id: number; name: string; slug: string; image_url?: string | null; }
export interface ProductImage { id: number; image_url: string; alt_text?: string; is_primary?: boolean; }
export interface ProductVariant { id: number; name: string; value?: string; price?: number; stock?: number; }
export interface Review { id: number; rating: number; comment?: string; user?: { name: string }; created_at?: string; }

export interface Product {
  id: number;
  slug: string;
  name: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  compare_price?: number | null;
  sku?: string;
  stock: number;
  rating?: number;
  total_reviews?: number;
  total_sold?: number;
  is_featured?: boolean;
  tags?: string[] | null;
  category?: Category | null;
  brand?: Brand | null;
  primary_image?: ProductImage | null;
  primaryImage?: ProductImage | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
  product_variant?: ProductVariant | null;
}

export interface Order {
  id: number;
  order_number?: string;
  status: string;
  total: number;
  created_at?: string;
  items?: Array<{ id: number; quantity: number; price: number; product?: Product; product_name?: string }>;
}
