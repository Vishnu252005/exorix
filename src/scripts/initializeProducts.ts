import { pushProductsToFirestore } from '../data/products';

const initializeProducts = async () => {
  try {
    console.log('Starting product initialization...');
    await pushProductsToFirestore();
    console.log('Product initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize products:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeProducts(); 