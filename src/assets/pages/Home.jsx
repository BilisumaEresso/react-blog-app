import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";

const Home = () => {
  const [load, setLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const auth = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const getPostList = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `/post?page=${currentPage}&size=${size}&q=${search}`
        );
        const data = response.data.data;
        setPosts(data.posts);
        setTotalPage(data.pages);
        setLoad(false);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setLoad(false);
      }
    };

    getPostList();
  }, [currentPage, size, search]);

  useEffect(() => {
    if (totalPage > 1) {
      let tempPageCount = [];
      for (let i = 1; i <= totalPage; i++) {
        tempPageCount = [...tempPageCount, i];
      }
      setPageCount(tempPageCount);
    } else {
      setPageCount([]);
    }
  }, [totalPage]);

  const handleSearch = async (e) => {
    const input = e.target.value;
    setSearch(input);
    try {
      const response = await axios.get(
        `/post?page=${currentPage}&q=${input}&size=${size}`
      );
      const data = response.data.data;
      setPosts(data.posts);
      setTotalPage(data.pages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome To My React Blog App
          </h1>
          <p className="text-gray-600">Discover amazing stories and insights</p>
        </div>

        {/* Admin Management Button */}
        {auth.role !== 3 && (
          <button
            className=" bg-blue-600 text-white px-6 py-3 rounded-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium mb-6"
            onClick={() => navigate("auth/manage-admin")}
          >
            Manage Admins
          </button>
        )}

        {/* Page Title */}
        <div className="bg-white rounded-lg border  border-gray-200 p-6 my-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Latest Posts
          </h2>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="max-w-md mx-auto">
            <div className="border border-blue-500 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
              <input
                onChange={handleSearch}
                value={search}
                type="text"
                name="search"
                className="border-none focus:outline-none px-4 py-3 w-full bg-transparent placeholder-gray-500 text-gray-900"
                placeholder="Search posts..."
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-600">Loading posts...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  onClick={() => navigate(`/posts/detail-post/${post._id}`)}
                  key={post._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 group"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {post.desc.substring(0, 100)}...
                    <span className="text-blue-500 text-sm font-medium block mt-2">
                      Read more →
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* No Posts Message */}
            {posts.length === 0 && !load && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  No posts found. Try a different search term.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pageCount.length > 1 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-center items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {pageCount.map((pageNumber, index) => (
                    <button
                      onClick={() => setCurrentPage(pageNumber)}
                      key={index}
                      disabled={currentPage === pageNumber}
                      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    disabled={currentPage === totalPage}
                    onClick={handleNext}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Page Size Selector */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  Posts per page:
                </label>
                <input
                  type="number"
                  name="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 text-center"
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
