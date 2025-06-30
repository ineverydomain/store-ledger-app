const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s-()]{10,}$/.test(v);
      },
      message: 'Invalid phone format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationType: {
    type: String,
    enum: ['email', 'phone'],
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

// Ensure either email or phone is provided
userSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone must be provided'));
  } else {
    next();
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);