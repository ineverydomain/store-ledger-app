const express = require('express');
const { body, validationResult } = require('express-validator');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all sales for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sale
router.post('/', auth, [
  body('productId').isMongoId(),
  body('quantitySold').isNumeric().isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantitySold } = req.body;

    // Find product
    const product = await Product.findOne({
      _id: productId,
      userId: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantitySold > product.quantity) {
      return res.status(400).json({ 
        message: `Insufficient quantity. Only ${product.quantity} ${product.unit} available` 
      });
    }

    // Create sale
    const sale = new Sale({
      productId,
      productName: product.name,
      quantitySold,
      unit: product.unit,
      pricePerUnit: product.price,
      totalAmount: quantitySold * product.price,
      userId: req.user._id,
    });

    await sale.save();

    // Update product quantity
    product.quantity -= quantitySold;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;