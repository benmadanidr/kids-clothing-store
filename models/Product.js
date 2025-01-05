const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories']
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    minQuantity: {
        type: Number,
        default: 5
    },
    description: String,
    imageUrl: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
