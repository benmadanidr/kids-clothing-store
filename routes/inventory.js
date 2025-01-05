const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get low stock items
router.get('/low-stock', async (req, res) => {
    try {
        const products = await Product.find({
            quantity: { $lte: '$minQuantity' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
