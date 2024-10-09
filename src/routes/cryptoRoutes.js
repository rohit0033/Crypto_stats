const express = require('express');
const router = express.Router();
const { getLatestStats, getPriceDeviation } = require('../services/cryptoService');

router.get('/stats', async (req, res) => {
  const { coin } = req.query;
  
  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  try {
    const latestData = await getLatestStats(coin);
    
    if (!latestData) {
      return res.status(404).json({ error: 'Data not found for the specified coin' });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/deviation', async (req, res) => {
  const { coin } = req.query;
  
  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  try {
    const deviation = await getPriceDeviation(coin);
    res.json({ deviation: parseFloat(deviation.toFixed(2)) });
  } catch (error) {
    if (error.message === 'No data found for the specified coin') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;
