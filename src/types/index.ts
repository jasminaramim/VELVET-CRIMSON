export type Language = 'en' | 'bn';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'categories'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'track-order'
  | 'wishlist'
  | 'about'
  | 'contact'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'returns';

export interface ProductColor {
  name: string;
  nameBn?: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  shortDescription: string;
  shortDescriptionBn: string;
  price: number;
  discountPrice?: number;
  category: string;
  categoryBn?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  sku: string;
  brand?: string;
  fabric?: string;
  care?: string;
  fit?: string;
  origin?: string;
  reviews?: Review[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSelling: boolean;
  isNewArrival: boolean;
  status: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  image: string;
  description?: string;
  descriptionBn?: string;
  productCount: number;
  status: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'cod' | 'bkash' | 'card' | 'nagad';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  status: OrderStatus;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  customerName: string;
  rating: number;
  comment: string;
  commentBn?: string;
  date: string;
  verified: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrder: number;
  expiryDate: string;
  status: boolean;
}

export interface HeroBanner {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  image: string;
  buttonText: string;
  buttonTextBn: string;
  secondaryButtonText: string;
  secondaryButtonTextBn: string;
  buttonLink: string;
  status: boolean;
  badge: string;
  badgeBn: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface UserAddress {
  id?: string;
  title: string;
  address: string;
  city: string;
  postalCode?: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  memberSince?: string;
  membershipTier?: string;
  addresses: UserAddress[];
}
