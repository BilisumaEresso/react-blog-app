import { useState } from "react";
import { useNavigate } from "react-router-dom";
import addCategoryValidator from "../../../validators/addCategoryValidator";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";

const NewCategory = () => {
  const InitialFormData = { title: "", desc: "" };
  const InitialFormError = { title: "" };
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (formError[e.target.name]) {
      setFormError((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addCategoryValidator({ title: formData.title }) || {
      title: "",
    };
    if (errors.title) {
      setFormError(errors);
    } else {
      try {
        setLoad(true);
        const response = await axios.post("/category", formData);
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(InitialFormData);
        setFormError(InitialFormError);
        navigate("/categories");
        setLoad(false);
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-300 font-medium border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md flex items-center space-x-2 mb-6"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm transition-colors duration-300">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
              Create New Category
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Add a new category to organize your blog posts
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category Title <span className="text-red-500">*</span>
              </label>
              <input
                className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner ${
                  formError.title
                    ? "ring-2 ring-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                type="text"
                name="title"
                placeholder="e.g., Technology, Lifestyle, Travel"
                onChange={handleChange}
                value={formData.title}
              />
              {formError.title && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formError.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="desc"
                placeholder="Describe what this category is about..."
                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner focus:ring-blue-500 resize-none font-sans"
                rows="4"
                onChange={handleChange}
                value={formData.desc}
              ></textarea>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                Optional: Add a description to help identify this category
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={load}
                className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
              >
                {load ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Category...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Category</span>
                    <svg className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* Form Tips */}
            <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5 mb-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-500 dark:text-blue-400 mt-0.5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">
                    Tips
                  </h3>
                  <div className="text-sm text-blue-800/80 dark:text-blue-200/80 space-y-1.5 font-medium">
                    <p>• Use clear, descriptive titles</p>
                    <p>• Keep descriptions concise but informative</p>
                    <p>• Consider how categories will help organize your content</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
