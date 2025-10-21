import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import resetPasswordValidator from "../../validators/resetPasswordValidator";
import sendCodeValidator from "../../validators/sendCodeValidator";

const ForgotPassword = () => {
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

  const handleRecoverPassword = async (e) => {
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
        navigate("/login");
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
    // Clear errors when user starts typing
    if (emailError && e.target.name === "email") {
      setEmailError("");
    }
    if (formError[e.target.name]) {
      setFormError((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {sentEmail ? "Reset Your Password" : "Forgot Password"}
          </h1>
          <p className="text-gray-600">
            {sentEmail
              ? "Enter the verification code and your new password"
              : "Enter your email to receive a verification code"}
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <form
            onSubmit={sentEmail ? handleRecoverPassword : handleSendCode}
            className="space-y-6"
          >
            {!sentEmail ? (
              /* Send Code Form */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  name="email"
                  className={`w-full px-4 py-3 border rounded-3 focus:outline-none focus:ring-2 transition-colors ${
                    emailError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter your email address"
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {emailError}
                  </p>
                )}
              </div>
            ) : (
              /* Reset Password Form */
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code *
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.code}
                    type="text"
                    name="code"
                    className={`w-full px-4 py-3 border rounded-3 focus:outline-none focus:ring-2 transition-colors ${
                      formError.code
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                  {formError.code && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formError.code}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.password}
                    type="password"
                    name="password"
                    className={`w-full px-4 py-3 border rounded-3 focus:outline-none focus:ring-2 transition-colors ${
                      formError.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Enter your new password"
                  />
                  {formError.password && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formError.password}
                    </p>
                  )}
                </div>

                {/* Email Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-3 p-4">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-400 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-700">
                        Verification code sent to:{" "}
                        <span className="font-medium">{formData.email}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={load}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {load ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {sentEmail ? "Resetting Password..." : "Sending Code..."}
                  </div>
                ) : sentEmail ? (
                  "Reset Password"
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {!sentEmail
              ? "We'll send a verification code to your email"
              : "Check your email for the verification code"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
