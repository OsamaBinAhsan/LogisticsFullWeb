export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  costPrice: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  variants: ProductVariant[];
  basePrice: number;
  images: string[];
  rating: number;
  reviewCount: number;
  badge?: 'new' | 'bestseller' | 'low-stock' | 'sale';
  isFeatured: boolean;
  createdAt: string;
  descriptionHtml?: string;
  specifications?: { label: string; value: string }[];
}

export type CreateProduct = Omit<Product, 'id' | 'slug' | 'createdAt'>;

export interface CartItem {

  id?: string;
  productId: string;
  variantId: string;
  name: string;
  slug?: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  sku: string;
  variantName?: string;
}


export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount: number;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type OrderChannel = 'web' | 'whatsapp' | 'facebook' | 'instagram';

export interface Address {
  name: string;
  phone: string;
  street: string;
  district: string;
  zone: 'dhaka_inside' | 'dhaka_sub' | 'outside_dhaka';
  landmark?: string;
}

export interface LineItem {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AuraOrder {
  id: string;
  invoiceNumber: string;
  channel: OrderChannel;
  status: OrderStatus;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    totalOrders: number;
    lifetimeValue: number;
  };
  shippingAddress: Address;
  lineItems: LineItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuraCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  lifetimeValue: number;
  averageOrderValue: number;
  lastOrderDate: string;
  firstOrderDate: string;
  returnRate: number;
  preferredChannel: OrderChannel;
  address?: Address;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface DashboardStats {
  netRevenue: number;
  totalOrders: number;
  aov: number;
  pendingShipments: number;
  outOfStockSkus: number;
  revenueChange: number;
  ordersChange: number;
}
