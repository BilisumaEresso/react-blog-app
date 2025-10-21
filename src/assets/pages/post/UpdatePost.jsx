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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-600">Loading post data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group bg-white text-gray-700 px-6 py-3 rounded-3 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium border border-gray-300 hover:border-blue-300 shadow-sm hover:shadow-md flex items-center space-x-2 mb-4"
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
            <span>Back to Posts</span>
          </button>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Update Post
            </h1>
            <p className="text-gray-600">Modify your blog post information</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                onChange={handleChange}
                value={formData.title}
                type="text"
                name="title"
                placeholder="Enter a compelling post title"
                className={`w-full px-4 py-3 border rounded-3 focus:outline-none focus:ring-2 transition-colors ${
                  formError.title
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {formError.title && (
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
                  {formError.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                onChange={handleChange}
                value={formData.desc}
                name="desc"
                placeholder="Write your post content here..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
              />
            </div>

            {/* File Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-3 p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  onChange={handleChangeFile}
                  type="file"
                  className="w-full"
                  accept=".png,.jpg,.jpeg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, JPEG files only. Max size: 5MB
                </p>
              </div>
              {extensionError && (
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
                  {extensionError}
                </p>
              )}
              {fileId && (
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Image uploaded successfully!
                </p>
              )}
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                onChange={handleChange}
                value={formData.category}
                name="category"
                className={`w-full px-4 py-3 border rounded-3 focus:outline-none focus:ring-2 transition-colors ${
                  formError.category
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
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
                  {formError.category}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                disabled={isDisabled || load}
                type="submit"
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
                    Updating Post...
                  </div>
                ) : (
                  "Update Post"
                )}
              </button>
            </div>

            {/* Form Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-3 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Update Tips
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      • Make sure your title accurately reflects the updated
                      content
                    </p>
                    <p>• Choose the most relevant category for your post</p>
                    <p>
                      • Upload a new image if you want to change the featured
                      image
                    </p>
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
