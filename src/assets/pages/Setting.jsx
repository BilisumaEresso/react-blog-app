import { useNavigate } from "react-router-dom";
import { useState } from "react";
import changePasswordValidator from "../../validators/changePasswordValidator";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const Setting = () => {
  const InitialFormData = {
    newPassword: "",
    oldPassword: "",
  };

  const InitialFormError = {
    newPassword: "",
    oldPassword: "",
  };

  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (formError[e.target.name]) {
      setFormError((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = changePasswordValidator({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    }) || { oldPassword: "", newPassword: "" };

    if (errors.oldPassword || errors.newPassword) {
      setFormError(errors);
    } else {
      try {
        const requestBody = {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        };
        setLoad(true);
        const response = await axios.put("/auth/change-password", requestBody);
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(InitialFormData);
        setFormError(InitialFormError);
        setLoad(false);
        window.localStorage.removeItem("blogData");
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

  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 p-8 mb-8 shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
                Account Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage your account security and preferences
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="group bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-semibold border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-2"
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
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 space-y-4 transition-colors duration-300">
              <button
                onClick={() => navigate("/verify-user")}
                className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                <span>Verify Account</span>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3.5 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold border-none shadow-sm flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Update Profile</span>
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Change Password
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Old Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner ${
                        formError.oldPassword ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                      }`}
                      type="password"
                      name="oldPassword"
                      placeholder="Enter your current password"
                      value={formData.oldPassword}
                      onChange={handleChange}
                    />
                    {formError.oldPassword && (
                      <p className="mt-2 text-sm text-red-500 dark:text-red-400 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formError.oldPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner ${
                        formError.newPassword ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                      }`}
                      type="password"
                      name="newPassword"
                      placeholder="Enter your new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    {formError.newPassword && (
                      <p className="mt-2 text-sm text-red-500 dark:text-red-400 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formError.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={load}
                      className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed text-lg group"
                    >
                      {load ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
