const express = require('express');
const router = express.Router();

router.post('/generate-link', (req, res) => {
  try {
    const { productName, quantity, userName, address } = req.body;

    if (!productName || !quantity || !userName || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const businessPhone = "6364893295"; 
    const message = `Hello, I would like to order ${productName} - ${quantity}. My details: ${userName}, ${address}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${businessPhone}&text=${encodedMessage}`;

    return res.status(200).json({ link: whatsappLink });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate link' });
  }
});

module.exports = router;
