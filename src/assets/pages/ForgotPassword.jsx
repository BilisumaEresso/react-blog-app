import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import resetPasswordValidator from "../../validators/resetPasswordValidator";
import sendCodeValidator from "../../validators/sendCodeValidator";

const Forgotapssword = () => {
  const InitialFormData = {
    email: "",
    password: "",
    code: "",
  };
  const InitialFormError = {
    password: "",
    code: "",
  };

  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);
  const [emailError, setEmailError] = useState("");
  const [sentEmail, setSentEmail] = useState(false);
    const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    const errors = sendCodeValidator({ email: formData.email }) || {
      email: "",
    };
    if (errors.email) {
      setEmailError(errors.email);
    } else {
      try {
        setLoad(true);
        const response = await axios.post("/auth/forgot-password", {
          email: formData.email,
        });
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        // api request
        setSentEmail(true);
        setLoad(false);
      } catch (error) {
        setSentEmail(false);
        setLoad(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }
  };

  const handleRecoverPassword = async(e) => {
    e.preventDefault();
    const errors = resetPasswordValidator({
      code: formData.code,
      password: formData.password,
    });
    if (errors.code || errors.password) {
      setFormError(errors);
    } else {
      try {
        setLoad(true);
        const requestBody = {
          email: formData.email,
          code: formData.code,
          newPassword: formData.password,
        };
        const response = await axios.post("/auth/reset-password", requestBody);
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setLoad(false);
        navigate("/login")
      } catch (error) {
        setLoad(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <div className="form-container">
        <form
          onSubmit={sentEmail ? handleRecoverPassword : handleSendCode}
          className="inner-container"
        >
          <h2 className="form-title">
            {sentEmail ? "Reset Password" : "Send Reset code"}
          </h2>
          {!sentEmail ? (
            <div className="form-group">
              <label>Email</label>
              <input
                onChange={handleChange}
                value={formData.email}
                type="email"
                name="email"
                className="form-control"
                placeholder="johndoe@gmil.com"
              />
              {emailError && <p className="error">{emailError}</p>}
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Code</label>
                <input
                  onChange={handleChange}
                  value={formData.code}
                  type="text"
                  name="code"
                  className="form-control"
                  placeholder="XXXXXX"
                />
                {formError.code && <p className="error">{formError.code}</p>}
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  onChange={handleChange}
                  value={formData.password}
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="XXXXXX"
                />
                {formError.password && (
                  <p className="error">{formError.password}</p>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="submit"
              value={
                sentEmail
                  ? !load
                    ? "Reset"
                    : "Sending.."
                  : !load
                  ? "Send"
                  : "Sending.."
              }
              className="button"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgotapssword;
