const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z\s\-']+$/.test(v);
      },
      message: 'Name must contain only letters, spaces, hyphens, or apostrophes',
    },
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{13}$/, 'ID number must be exactly 13 digits'],
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Account number must be exactly 10 digits',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/.test(v);
      },
      message:
        'Password must be at least 8 characters long, with at least 1 uppercase letter, 1 number, and 1 special character',
    },
  },
  role: {
    type: String,
    enum: ['customer', 'employee'],
    default: 'customer',
    required: true,
  },
}, { timestamps: true });

// ✅ Pre-save middleware: Check for duplicate ID/account number
userSchema.pre('save', async function (next) {
  const user = this;
  try {
    const existingUserById = await mongoose.models.User.findOne({ idNumber: user.idNumber });
    const existingUserByAccount = await mongoose.models.User.findOne({ accountNumber: user.accountNumber });

    if (existingUserById) {
      return next(new Error('ID number already exists.'));
    }

    if (existingUserByAccount) {
      return next(new Error('Account number already exists.'));
    }

    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Pre-save middleware: Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Post-save middleware: Handle duplicate errors
userSchema.post('save', function (err, doc, next) {
  if (err.code === 11000) {
    if (err.message.includes('idNumber')) {
      err.message = 'ID number already exists.';
    } else if (err.message.includes('accountNumber')) {
      err.message = 'Account number already exists.';
    }
  }
  next(err);
});

module.exports = mongoose.model('User', userSchema);
