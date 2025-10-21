import { useState, useEffect } from "react";
import updateProfileValidator from "../../validators/updateProfileValidator";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const InitialFormData = {
    name: "",
    email: "",
  };
  const InitialFormError = {
    email: "",
  };

  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);
  const navigate = useNavigate();

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/current-user");
        const userData = response.data.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.log(error)
        toast.error("Failed to load user data", {
          position: "top-right",
          autoClose: true,
        });
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (formError[e.target.name]) {
      setFormError((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = updateProfileValidator({
      email: formData.email,
    }) || { email: "" };

    if (errors.email) {
      setFormError(errors);
    } else {
      try {
        const requestBody = {
          name: formData.name,
          email: formData.email,
        };
        setLoad(true);
        const response = await axios.put("/auth/update-profile", requestBody);
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Update Profile
          </h1>
          <p className="text-gray-600">Keep your information up to date</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  type="email"
                  name="email"
                  placeholder="doe@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formError.email && (
                  <p className="mt-2 text-sm text-red-600">{formError.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={load}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {load ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Profile...</span>
                  </div>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            ← Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
