import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import axios from "../../utils/axiosInstance";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import verificationCodeValidator from "../../validators/verificationCodeValidator";

const VerifyUser = () => {
  const auth = useAuth();
  const email = auth.email;
  const [sendLoad, setSendLoad] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState({ code: "" });
  const [load, setLoad] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = verificationCodeValidator({ code: code }) || { code: "" };
    if (errors.code) {
      setCodeError(errors);
    } else {
      try {
        setSendLoad(true);
        const response = await axios.post("/auth/user-verification", {
          email: email,
          code: code,
        });
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setSendLoad(false);
        setCode("");
        // Redirect to login after successful verification
        setTimeout(() => {
          window.localStorage.removeItem("blogData");
          navigate("/login");
        }, 2000);
      } catch (error) {
        setSendLoad(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }
  };

  const sendVerificationCode = async () => {
    try {
      setLoad(true);
      const response = await axios.post("/auth/send-verification-email", {
        email: email,
      });
      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      setLoad(false);
      setEmailSent(true);
      setResendCooldown(30); // 30 seconds cooldown
    } catch (error) {
      setLoad(false);
      setEmailSent(false);
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only numbers, max 6 digits
    setCode(value);
    if (codeError.code) {
      setCodeError({ code: "" });
    }
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      sendVerificationCode();
      setEmailSent(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="group bg-white text-gray-700 px-6 py-3 rounded-3 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium border border-gray-300 hover:border-blue-300 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Settings</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Account
              </h1>
              <p className="text-gray-600">
                Secure your account with email verification
              </p>
            </div>
          </div>
        </div>

        {/* Send Verification Code Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Send Verification Code
            </h3>
            <p className="text-gray-600 mb-4">
              We'll send a 6-digit code to your email address
            </p>
            <button
              disabled={load || resendCooldown > 0}
              onClick={sendVerificationCode}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {load ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Code...</span>
                </div>
              ) : resendCooldown > 0 ? (
                `Resend available in ${resendCooldown}s`
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        </div>

        {/* Verification Form */}
        {emailSent && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Check your email for the 6-digit code
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={handleChange}
                    name="code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-400 text-center text-xl font-semibold tracking-widest"
                    placeholder="123456"
                    maxLength="6"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {codeError.code && (
                    <p className="mt-2 text-sm text-red-600 text-center">
                      {codeError.code}
                    </p>
                  )}
                </div>

                <button
                  disabled={!emailSent || sendLoad || code.length !== 6}
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-3 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {sendLoad ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Account...</span>
                    </div>
                  ) : (
                    "Verify Account"
                  )}
                </button>
              </div>
            </form>

            {/* Resend Code Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-3">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : "Resend verification code"}
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {sendLoad && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                Verification successful! Redirecting to login...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyUser;
