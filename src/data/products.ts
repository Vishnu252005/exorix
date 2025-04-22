import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Gaming Mouse Pro X',
    description: 'High-performance gaming mouse with customizable RGB lighting and 16000 DPI sensor',
    price: 79.99,
    stock: 50,
    rating: 4.8,
    reviewCount: 245,
    image: '/products/mouse.jpg',
    brand: 'TechGear',
    category: 'Gaming Peripherals',
    tags: ['gaming', 'mouse', 'rgb'],
    variants: [
      {
        id: '1-1',
        name: 'Black',
        price: 79.99,
        stock: 30,
        image: '/products/mouse-black.jpg',
        color: 'black'
      },
      {
        id: '1-2',
        name: 'White',
        price: 79.99,
        stock: 20,
        image: '/products/mouse-white.jpg',
        color: 'white'
      }
    ],
    specifications: [
      {
        category: 'Technical',
        items: [
          { label: 'DPI', value: '16000' },
          { label: 'Buttons', value: '8' },
          { label: 'Connection', value: 'Wireless/Wired' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'John Doe',
        userAvatar: '/avatars/john.jpg',
        rating: 5,
        comment: 'Best gaming mouse I've ever used!',
        date: '2024-03-15',
        likes: 12,
        helpful: true
      }
    ],
    images: [
      '/products/mouse-1.jpg',
      '/products/mouse-2.jpg',
      '/products/mouse-3.jpg'
    ],
    features: [
      '16000 DPI sensor',
      'Wireless and wired modes',
      'RGB lighting',
      '8 programmable buttons'
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    description: 'Full-size mechanical keyboard with Cherry MX switches and per-key RGB',
    price: 129.99,
    stock: 35,
    rating: 4.7,
    reviewCount: 189,
    image: '/products/keyboard.jpg',
    brand: 'TechGear',
    category: 'Gaming Peripherals',
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
    variants: [
      {
        id: '2-1',
        name: 'Red Switch',
        price: 129.99,
        stock: 15,
        image: '/products/keyboard-red.jpg'
      },
      {
        id: '2-2',
        name: 'Blue Switch',
        price: 129.99,
        stock: 20,
        image: '/products/keyboard-blue.jpg'
      }
    ],
    specifications: [
      {
        category: 'Technical',
        items: [
          { label: 'Switch Type', value: 'Cherry MX' },
          { label: 'Layout', value: 'Full-size' },
          { label: 'Backlight', value: 'RGB' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Jane Smith',
        userAvatar: '/avatars/jane.jpg',
        rating: 4,
        comment: 'Great build quality and responsive keys',
        date: '2024-03-14',
        likes: 8,
        helpful: true
      }
    ],
    images: [
      '/products/keyboard-1.jpg',
      '/products/keyboard-2.jpg',
      '/products/keyboard-3.jpg'
    ],
    features: [
      'Cherry MX switches',
      'Per-key RGB lighting',
      'Aircraft-grade aluminum frame',
      'USB pass-through port'
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-03-14'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (product: Product): Product[] => {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
}; 