const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const {
  validateName,
  validateID,
  validateAccountNumber,
  validatePassword,
} = require('../utils/validator');

// === Register User (Only customers) ===
exports.registerUser = async (req, res) => {
  const { name, idNumber, accountNumber, password } = req.body;

  // === Input Validation ===
  if (!name || !idNumber || !accountNumber || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const nameValidation = validateName(name);
  if (nameValidation !== true) return res.status(400).json({ message: nameValidation });

  const idValidation = validateID(idNumber);
  if (idValidation !== true) return res.status(400).json({ message: idValidation });

  const accountValidation = validateAccountNumber(accountNumber);
  if (accountValidation !== true) return res.status(400).json({ message: accountValidation });

  const passwordValidation = validatePassword(password);
  if (passwordValidation !== true) return res.status(400).json({ message: passwordValidation });

  try {
    // === Check for existing user ===
    const existingUser = await User.findOne({
      $or: [{ idNumber }, { accountNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this ID number or account number already exists.',
      });
    }

    // === Password Hashing ===
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // === Save New Customer ===
    const user = new User({
      name,
      idNumber,
      accountNumber,
      password: hashedPassword,
      role: 'customer',
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('❌ Registration error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    if (error.code === 11000) {
      const conflictField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${conflictField} already exists.`,
      });
    }

    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

// === Login User (customer or employee) ===
exports.loginUser = async (req, res) => {
  const { accountNumber, password } = req.body;

  if (!accountNumber || !password) {
    return res.status(400).json({ message: 'Both account number and password are required.' });
  }

  try {
    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(400).json({ message: 'Invalid account number or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid account number or password.' });
    }

    // NOTE: Use "id" here instead of "userId" for consistency with typical JWT payloads and your verify middleware
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      role: user.role,
      message: 'Login successful.',
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
