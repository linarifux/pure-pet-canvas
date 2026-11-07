import dotenv from 'dotenv';
// 1. Load the environment variables FIRST
dotenv.config(); 

// 2. THEN import the printify instance so it can read process.env.PRINTIFY_ACCESS_TOKEN
import printify from './config/printify.js';

const fetchShopId = async () => {
  try {
    const response = await printify.get('/shops.json');
    
    console.log('--- Your Printify Shops ---');
    console.log(JSON.stringify(response.data, null, 2)); 
    
    process.exit();
  } catch (error) {
    console.error('Error fetching shops:', error.response?.data || error.message);
    process.exit(1);
  }
};

fetchShopId();
