import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 5000;
connectDatabase().then(() => app.listen(port, () => console.log(`Mystery Room API listening on ${port}`))).catch((error) => {
  console.error('Database connection failed:', error.message);
  process.exit(1);
});
