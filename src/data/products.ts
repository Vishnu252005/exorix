import { Product } from '../types/product';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

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

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'keyboard' | 'mouse' | 'headset' | 'monitor' | 'accessories' | 'chair' | 'desk' | 'controller';
  brand: string;
  rating: number;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
}

export const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Exorix Pro Gaming Keyboard',
    description: 'Mechanical RGB gaming keyboard with Cherry MX switches, customizable backlighting, and macro keys.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&q=80',
    category: 'keyboard',
    brand: 'Exorix Gaming',
    rating: 4.8,
    stock: 50,
    isFeatured: true,
    features: [
      'Cherry MX Blue Switches',
      'Per-key RGB lighting',
      'Aircraft-grade aluminum frame',
      'Detachable wrist rest',
      'USB pass-through port'
    ],
    specifications: {
      'Switch Type': 'Mechanical (Cherry MX Blue)',
      'Backlighting': 'RGB (16.8M colors)',
      'Connection': 'USB-C',
      'Dimensions': '17.5 x 5.5 x 1.4 inches',
      'Weight': '2.5 lbs'
    }
  },
  {
    name: 'Exorix Precision Gaming Mouse',
    description: 'High-precision gaming mouse with 16K DPI sensor, customizable weights, and RGB lighting.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&q=80',
    category: 'mouse',
    brand: 'Exorix Gaming',
    rating: 4.9,
    stock: 75,
    isFeatured: true,
    features: [
      '16,000 DPI optical sensor',
      '8 programmable buttons',
      'Adjustable weights',
      'RGB lighting zones',
      'On-board memory profiles'
    ],
    specifications: {
      'Sensor': 'Optical (16K DPI)',
      'Buttons': '8 programmable',
      'Connection': 'USB / 2.4GHz Wireless',
      'Battery Life': '60 hours',
      'Weight': '95g (adjustable)'
    }
  },
  {
    name: 'Exorix Elite Gaming Chair',
    description: 'Premium gaming chair with 4D armrests, lumbar support, and memory foam cushions.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80',
    category: 'chair',
    brand: 'Exorix Gaming',
    rating: 4.9,
    stock: 25,
    isFeatured: true,
    features: [
      '4D Adjustable Armrests',
      'Memory Foam Cushions',
      'Lumbar Support',
      'Reclining Backrest',
      'Premium PU Leather'
    ],
    specifications: {
      'Material': 'Premium PU Leather',
      'Weight Capacity': '330 lbs',
      'Height': 'Adjustable 17.7" - 21.7"',
      'Recline': '90° - 180°',
      'Warranty': '5 Years'
    }
  },
  {
    name: 'Exorix Vision Gaming Monitor',
    description: '27" 1440p gaming monitor with 165Hz refresh rate, 1ms response time, and G-Sync compatibility.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1616763355603-9755a640a287?auto=format&fit=crop&q=80',
    category: 'monitor',
    brand: 'Exorix Gaming',
    rating: 4.9,
    stock: 30,
    features: [
      '27" QHD Display (2560x1440)',
      '165Hz Refresh Rate',
      '1ms Response Time',
      'G-Sync Compatible',
      'HDR400'
    ],
    specifications: {
      'Resolution': '2560x1440',
      'Panel Type': 'IPS',
      'Refresh Rate': '165Hz',
      'Response Time': '1ms GtG',
      'HDR': 'HDR400'
    }
  },
  {
    name: 'Exorix Pro Controller',
    description: 'Wireless gaming controller with customizable buttons, RGB lighting, and motion controls.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
    category: 'controller',
    brand: 'Exorix Gaming',
    rating: 4.6,
    stock: 45,
    features: [
      'Wireless Connectivity',
      'Customizable Buttons',
      'RGB Lighting',
      'Motion Controls',
      'Haptic Feedback'
    ],
    specifications: {
      'Battery Life': '20 hours',
      'Connection': 'Bluetooth 5.0',
      'Compatibility': 'PC, PS5, Xbox',
      'Weight': '250g',
      'Warranty': '2 Years'
    }
  },
  {
    name: 'Exorix RGB Mouse Pad',
    description: 'Large RGB gaming mouse pad with non-slip base and smooth tracking surface.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?auto=format&fit=crop&q=80',
    category: 'accessories',
    brand: 'Exorix Gaming',
    rating: 4.5,
    stock: 100,
    features: [
      'RGB Edge Lighting',
      'Non-slip Rubber Base',
      'Smooth Tracking Surface',
      'Waterproof',
      'Stitched Edges'
    ],
    specifications: {
      'Size': '900 x 400 x 3mm',
      'Material': 'Micro-woven Cloth',
      'Connection': 'USB',
      'Compatibility': 'All Mice',
      'Warranty': '1 Year'
    }
  }
];

// Function to push initial products to Firestore
export const pushProductsToFirestore = async () => {
  try {
    console.log('Starting to push products to Firestore...');
    const productsCollection = collection(db, 'products');
    
    // Add each product to Firestore
    const results = await Promise.all(
      INITIAL_PRODUCTS.map(async (product) => {
        try {
          const docRef = await addDoc(productsCollection, {
            ...product,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log('Product added with ID: ', docRef.id);
          return docRef;
        } catch (e) {
          console.error('Error adding product: ', product.name, e);
          return null;
        }
      })
    );

    const successCount = results.filter(Boolean).length;
    console.log(`Successfully added ${successCount} out of ${INITIAL_PRODUCTS.length} products`);
    
    return results;
  } catch (e) {
    console.error('Error in pushProductsToFirestore: ', e);
    throw e;
  }
}; 