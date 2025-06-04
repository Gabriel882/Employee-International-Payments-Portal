// === Name Validation ===
// Allows letters, spaces, hyphens, apostrophes
const nameRegex = /^[a-zA-Z\s\-']+$/;
const validateName = (name) => {
  if (!name || name.trim().length < 3) {
    return 'Name must be at least 3 characters long.';
  }
  if (!nameRegex.test(name.trim())) {
    return 'Name may only contain letters, spaces, hyphens, or apostrophes.';
  }
  return true;
};

// === ID Number Validation ===
// South African 13-digit ID (numeric only)
const idRegex = /^\d{13}$/;
const validateID = (idNumber) => {
  if (!idNumber) return 'ID number is required.';
  if (!idRegex.test(idNumber)) {
    return 'ID number must be exactly 13 digits.';
  }
  return true;
};

// === Account Number Validation ===
// Must be numeric and exactly 10 digits
const accountNumberRegex = /^\d{10}$/;
const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) return 'Account number is required.';
  if (!accountNumberRegex.test(accountNumber)) {
    return 'Account number must be exactly 10 digits and numeric.';
  }
  return true;
};

// === Password Validation ===
// Min 8 chars, 1 uppercase, 1 digit, 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*).';
  }
  return true;
};

module.exports = {
  validateName,
  validateID,
  validateAccountNumber,
  validatePassword,
};
