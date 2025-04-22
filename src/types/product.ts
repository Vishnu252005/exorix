export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  color?: string;
  size?: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  helpful: boolean;
}

export interface ProductSpecification {
  category: string;
  items: {
    label: string;
    value: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  brand: string;
  category: string;
  tags: string[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  model3D?: string;
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
} 