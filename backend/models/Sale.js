const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
saleSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);