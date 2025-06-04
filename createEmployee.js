const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const employees = [
  {
    name: 'Alice Johnson',
    idNumber: '1234567890123', // 13-digit ID
    accountNumber: '1000000005',  // 10-digit ID
    password: 'AliceStrongPass1!',
    role: 'employee',
  },
  {
    name: 'Bob Smith',
    idNumber: '4567865432123', // 13-digit ID
    accountNumber: '1000000006',  // 10-digit ID
    password: 'BobSecurePass2@',
    role: 'employee',
  }
];

const createEmployees = async () => {
  try {
    for (const emp of employees) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(emp.password, salt);

      const newUser = new User({
        name: emp.name,
        idNumber: emp.idNumber,
        accountNumber: emp.accountNumber,
        password: emp.password, // raw password!
        role: emp.role,
      });
      
      await newUser.save(); // ✅ will validate and hash inside the model
      
    }

    console.log('✅ Employees created successfully');
    await mongoose.disconnect();
  } catch (error) {
    if (error.name === 'ValidationError') {
      for (let field in error.errors) {
        console.error(`❌ Validation error on ${field}: ${error.errors[field].message}`);
      }
    } else if (error.message.includes('already exists')) {
      console.error(`❌ Duplicate error: ${error.message}`);
    } else {
      console.error('❌ Error creating employees:', error);
    }
    await mongoose.disconnect();
  }
};


createEmployees();
