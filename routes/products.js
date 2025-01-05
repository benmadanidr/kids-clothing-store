const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        category: req.body.category,
        size: req.body.size,
        price: req.body.price,
        cost: req.body.cost,
        quantity: req.body.quantity
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Search products
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
