import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const printify = axios.create({
  baseURL: 'https://api.printify.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export default printify;
