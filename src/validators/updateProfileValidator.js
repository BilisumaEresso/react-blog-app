const updateProfileValidator = ({ email }) => {
  function isValidEmail(email) {
    const emailStr = String(email).toLowerCase();
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(emailStr);
  }

  const errors = {
    email: ""
  };
  
 if (email&&!isValidEmail(email)) {
    errors.email = "invalid email";
  }

  return errors;
};

export default updateProfileValidator;
