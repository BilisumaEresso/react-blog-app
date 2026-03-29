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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8 text-center shadow-sm transition-colors duration-300">
          <button
            onClick={() => navigate(-1)}
            className="group absolute top-8 left-8 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
          >
            <svg
              className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
            Verify Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Secure your account with email verification
          </p>
        </div>

        {/* Send Verification Code Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 mb-6 transition-colors duration-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Send Verification Code
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
              We'll send a 6-digit code to your email address
            </p>
            <button
              disabled={load || resendCooldown > 0}
              onClick={sendVerificationCode}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {load ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 transition-colors duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Check your email for the 6-digit code
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={handleChange}
                    name="code"
                    className="block w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner text-center text-3xl font-mono font-bold tracking-[0.5em]"
                    placeholder="123456"
                    maxLength="6"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {codeError.code && (
                    <p className="mt-3 text-sm text-red-500 dark:text-red-400 font-medium text-center flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {codeError.code}
                    </p>
                  )}
                </div>

                <button
                  disabled={!emailSent || sendLoad || code.length !== 6}
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 px-4 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                >
                  {sendLoad ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Verifying Account...</span>
                    </div>
                  ) : (
                    "Verify Account"
                  )}
                </button>
              </div>
            </form>

            {/* Resend Code Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3 font-medium">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-5 mt-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 text-green-800 dark:text-green-300">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">
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
