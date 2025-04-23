import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBJSEAWssnwFNVAGRlhM6hxP7IJXLKdN04",
  authDomain: "stellar-a0f58.firebaseapp.com",
  projectId: "stellar-a0f58",
  storageBucket: "stellar-a0f58.firebasestorage.app",
  messagingSenderId: "850623372300",
  appId: "1:850623372300:web:87f612b27998a4048da229",
  measurementId: "G-WXYDRNN5MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ALL_PRODUCTS = [
  // Original products
  {
    name: 'Gaming Mouse Pro X',
    description: 'High-performance gaming mouse with customizable RGB lighting and 16000 DPI sensor',
    price: 79.99,
    stock: 50,
    rating: 4.8,
    reviewCount: 245,
    image: '/products/mouse.jpg',
    brand: 'TechGear',
    category: 'mouse',
    tags: ['gaming', 'mouse', 'rgb'],
    features: [
      '16000 DPI sensor',
      'Wireless and wired modes',
      'RGB lighting',
      '8 programmable buttons'
    ],
    specifications: {
      'DPI': '16000',
      'Buttons': '8',
      'Connection': 'Wireless/Wired'
    }
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Full-size mechanical keyboard with Cherry MX switches and per-key RGB',
    price: 129.99,
    stock: 35,
    rating: 4.7,
    reviewCount: 189,
    image: '/products/keyboard.jpg',
    brand: 'TechGear',
    category: 'keyboard',
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
    features: [
      'Cherry MX switches',
      'Per-key RGB lighting',
      'Aircraft-grade aluminum frame',
      'USB pass-through port'
    ],
    specifications: {
      'Switch Type': 'Cherry MX',
      'Layout': 'Full-size',
      'Backlight': 'RGB'
    }
  },
  // Exorix products
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

async function pushProductsToFirestore() {
  try {
    console.log('Starting to push products to Firestore...');
    const productsCollection = collection(db, 'products');
    
    for (const product of ALL_PRODUCTS) {
      try {
        const docRef = await addDoc(productsCollection, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('Added product:', product.name, 'with ID:', docRef.id);
      } catch (e) {
        console.error('Error adding product:', product.name, e);
      }
    }
    
    console.log('Finished pushing products to Firestore');
  } catch (e) {
    console.error('Error in pushProductsToFirestore:', e);
  }
}

// Run the function
pushProductsToFirestore(); 