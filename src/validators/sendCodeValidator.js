const sendCodeValidator = ({  email }) => {
  function isValidEmail(email) {
    const emailStr = String(email).toLowerCase();
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(emailStr);
}
const errors={email:""}
   if (!email) {
    errors.email = "email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "invalid email";
  }
  return errors
}

export default sendCodeValidator