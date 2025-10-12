const loginValidator = ({ email, password }) => {
  function isValidEmail(email) {
    const emailStr = String(email).toLowerCase();
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(emailStr);
  }

  const errors = {
    email: "",
    password: ""
  };

  if (!email) {
    errors.email = "email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "invalid email";
  }
  if (!password) {
    errors.password = "password is required";
  } else if (password.length < 6) {
    errors.password = "password must be at least 6 characters long";
  }

  return errors;
};

export default loginValidator;
