import { pushProductsToFirestore } from '../data/products';

const initializeFirestore = async () => {
  try {
    console.log('Starting to push products to Firestore...');
    await pushProductsToFirestore();
    console.log('Successfully initialized Firestore with products!');
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
  }
};

// Run the initialization
initializeFirestore(); 