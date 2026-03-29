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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8 text-center shadow-sm transition-colors duration-300">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
            {sentEmail ? "Reset Your Password" : "Forgot Password"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {sentEmail
              ? "Enter the verification code and your new password"
              : "Enter your email to receive a verification code"}
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 transition-colors duration-300">
          <form
            onSubmit={sentEmail ? handleRecoverPassword : handleSendCode}
            className="space-y-6"
          >
            {!sentEmail ? (
              /* Send Code Form */
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  name="email"
                  className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner ${
                    emailError
                      ? "ring-2 ring-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder="Enter your email address"
                />
                {emailError && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {emailError}
                  </p>
                )}
              </div>
            ) : (
              /* Reset Password Form */
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.code}
                    type="text"
                    name="code"
                    className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner text-center font-mono tracking-widest text-lg ${
                      formError.code
                        ? "ring-2 ring-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                  {formError.code && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center justify-center font-medium">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formError.code}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.password}
                    type="password"
                    name="password"
                    className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner ${
                      formError.password
                        ? "ring-2 ring-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                    placeholder="Enter your new password"
                  />
                  {formError.password && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formError.password}
                    </p>
                  )}
                </div>

                {/* Email Info */}
                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 mt-6">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-medium break-all">
                        Verification code sent to: <span className="font-bold">{formData.email}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={load}
                className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
              >
                {load ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors duration-300 flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
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
