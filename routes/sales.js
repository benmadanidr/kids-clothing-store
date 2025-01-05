const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Record new sale
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;
        
        // Update inventory for each sold item
        for (let item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Product ${item._id} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient quantity for ${product.name}` });
            }
            
            product.quantity -= item.quantity;
            await product.save();
        }
        
        res.status(200).json({ message: 'Sale recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
