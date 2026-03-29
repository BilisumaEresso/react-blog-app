import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import addPostValidator from "../../../validators/addPostValidator";
import { useState, useEffect } from "react";

const UpdatePost = () => {
  const InitialFormData = { title: "", desc: "", category: "" };
  const InitialFormError = { title: "", category: "" };
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);
  const [categories, setCategories] = useState([]);
  const [extensionError, setExtensionError] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [load, setLoad] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;

  // Fetch post data and categories on component mount
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setFetching(true);
        // Fetch post details
        const postResponse = await axios.get(`/post/detail-post/${postId}`);
        const postData = postResponse.data.data.post;

        setFormData({
          title: postData.title || "",
          desc: postData.desc || "",
          category: postData.category?._id || "",
        });

        // Fetch categories
        const categoryResponse = await axios.get(`/category?size=${1000}`);
        const categoryData = categoryResponse.data.data;
        setCategories(categoryData.category);

        setFetching(false);
      } catch (error) {
        setFetching(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
        navigate("/posts");
      }
    };

    fetchPostData();
  }, [postId, navigate]);

  const handleChangeFile = async (e) => {
    const formInput = new FormData();
    formInput.append("image", e.target.files[0]);
    const type = e.target.files[0].type;
    if (type === "image/png" || type === "image/jpg" || type === "image/jpeg") {
      setExtensionError(null);
      try {
        setIsDisabled(true);
        const response = await axios.post("/file/upload", formInput);
        const data = response.data;
        setFileId(data.data._id);
        toast.success("Image uploaded successfully!", {
          position: "top-right",
          autoClose: true,
        });
        setIsDisabled(false);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setIsDisabled(false);
      }
    } else {
      setExtensionError("Only PNG, JPG, or JPEG files are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addPostValidator({
      title: formData.title,
      category: formData.category,
    }) || {
      title: "",
      category: "",
    };

    if (errors.title || errors.category) {
      setFormError(errors);
    } else {
      try {
        setLoad(true);

        let input = formData;
        if (fileId) {
          input = { ...input, file: fileId };
        }

        const response = await axios.put(`/post/update-post/${postId}`, input);
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(InitialFormData);
        setFormError(InitialFormError);
        navigate("/posts");
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (formError[e.target.name]) {
      setFormError((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm animate-pulse transition-colors duration-300">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-auto"></div>
          </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Update Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Modify your blog post information
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                value={formData.title}
                type="text"
                name="title"
                placeholder="Enter a compelling post title"
                className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner ${
                  formError.title
                    ? "ring-2 ring-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
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
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                onChange={handleChange}
                value={formData.desc}
                name="desc"
                placeholder="Write your post content here..."
                rows="8"
                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner focus:ring-blue-500 resize-none font-sans"
              />
            </div>

            {/* File Upload Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50/50 dark:bg-gray-800/30 group">
                <input
                  onChange={handleChangeFile}
                  type="file"
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 dark:hover:file:bg-blue-900/50 cursor-pointer"
                  accept=".png,.jpg,.jpeg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
                  PNG, JPG, JPEG files only. Max size: 5MB
                </p>
              </div>
              {extensionError && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-3 flex items-center font-medium bg-red-50 dark:bg-red-900/10 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {extensionError}
                </p>
              )}
              {fileId && (
                <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-3 flex items-center font-medium bg-emerald-50 dark:bg-emerald-900/10 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Image uploaded and ready!
                </p>
              )}
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                value={formData.category}
                name="category"
                className={`block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner appearance-none cursor-pointer ${
                  formError.category
                    ? "ring-2 ring-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
              {formError.category && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formError.category}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                disabled={isDisabled || load}
                type="submit"
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
                    Updating Post...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Save Update</span>
                    <svg className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
                    Update Tips
                  </h3>
                  <div className="text-sm text-blue-800/80 dark:text-blue-200/80 space-y-1.5 font-medium">
                    <p>• Make sure your title accurately reflects the updated content</p>
                    <p>• Choose the most relevant category for your post</p>
                    <p>• Upload a new image if you want to change the featured image</p>
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

export default UpdatePost;
