const axios = require('axios');
const Crypto = require('../models/Crypto');

const fetchCryptoData = async () => {
  const coins = ['bitcoin', 'matic-network', 'ethereum'];
  for (const coin of coins) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`);
      const data = response.data;
      
      const cryptoData = new Crypto({
        coin: coin,
        price: data.market_data.current_price.usd,
        marketCap: data.market_data.market_cap.usd,
        change24h: data.market_data.price_change_percentage_24h,
      });

      await cryptoData.save();
      console.log(`Data for ${coin} saved successfully`);
    } catch (error) {
      console.error(`Error fetching data for ${coin}:`, error);
    }
  }
};

const getLatestStats = async (coin) => {
  return await Crypto.findOne({ coin }).sort({ timestamp: -1 });
};

const getPriceDeviation = async (coin) => {
  const data = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);
  if (data.length === 0) {
    throw new Error('No data found for the specified coin');
  }
  if (data.length < 2) {
    throw new Error('Insufficient data to calculate deviation');
  }
  const prices = data.map(item => item.price);
  console.log(`Calculating deviation for ${coin}. Number of prices: ${prices.length}`);
  console.log(`Price range: ${Math.min(...prices)} to ${Math.max(...prices)}`);
  return calculateStandardDeviation(prices);
};

const calculateStandardDeviation = (values) => {
  const n = values.length;
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / (n - 1); // Use (n-1) for sample standard deviation
  const stdDev = Math.sqrt(variance);
  console.log(`Mean: ${mean}, Variance: ${variance}, Standard Deviation: ${stdDev}`);
  return stdDev;
};

module.exports = {
  fetchCryptoData,
  getLatestStats,
  getPriceDeviation
};
