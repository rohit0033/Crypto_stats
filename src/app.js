require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const connectToDatabase = require('./config/database');
const { fetchCryptoData } = require('./services/cryptoService');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(express.json());

// Use routes
app.use('/api', cryptoRoutes);

// Schedule background job
cron.schedule('0 */2 * * * ', fetchCryptoData);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  fetchCryptoData(); // Run the initial data fetch
});
