const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', auth, [
  body('name').notEmpty().trim().escape(),
  body('quantity').isNumeric().isFloat({ min: 0 }),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('unit').isIn(['kg', 'g', 'l', 'ml', 'm', 'cm', 'mm', 'pcs', 'box', 'pack', 'dozen', 'pair']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, quantity, price, unit } = req.body;

    const product = new Product({
      name,
      quantity,
      price,
      unit,
      userId: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', auth, [
  body('name').notEmpty().trim().escape(),
  body('quantity').isNumeric().isFloat({ min: 0 }),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('unit').isIn(['kg', 'g', 'l', 'ml', 'm', 'cm', 'mm', 'pcs', 'box', 'pack', 'dozen', 'pair']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, quantity, price, unit } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, quantity, price, unit },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;