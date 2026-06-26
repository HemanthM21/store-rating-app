const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
  return regex.test(password);
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateName = (name) => {
  return name && name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
  return address && address.length <= 400;
};

const getPasswordError = () => {
  return 'Password must be 8-16 characters, include at least one uppercase letter and one special character';
};

module.exports = {
  validatePassword,
  validateEmail,
  validateName,
  validateAddress,
  getPasswordError,
};
