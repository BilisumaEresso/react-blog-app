import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import moment from "moment";

const PostList = () => {
  const [load, setLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

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

  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6 shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
                Blog Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all your blog posts
              </p>
            </div>
            <button
              onClick={() => navigate("new-post")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 shadow-md shadow-blue-500/20 font-medium flex items-center space-x-2 group hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add New Post</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-8 shadow-sm transition-colors duration-300">
          <div className="max-w-2xl">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Posts
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                onChange={handleSearch}
                value={search}
                type="text"
                name="search"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner"
                placeholder="Search by post title or content..."
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div key={k} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm h-48 animate-pulse flex flex-col justify-between">
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-5/6"></div>
                </div>
                <div className="h-4 bg-blue-200/50 dark:bg-blue-900/50 rounded-md w-1/4 mt-4 flex justify-between"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  onClick={() => navigate(`/posts/detail-post/${post._id}`)}
                  key={post._id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    {post.category && (
                      <span className="inline-block bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-blue-600/10 dark:ring-blue-400/20">
                        {post.category.title}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {post.desc.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                    <span className="font-medium text-xs tracking-wide uppercase">{moment(post.createdAt).format("MMM D, YYYY")}</span>
                    <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
                      <span>Read</span>
                      <svg
                        className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* No Posts Message */}
            {posts.length === 0 && !load && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 transition-colors">
                  <svg
                    className="w-8 h-8 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or create a new post.
                </p>
                <button
                  onClick={() => navigate("new-post")}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors font-medium shadow-sm"
                >
                  Create Your First Post
                </button>
              </div>
            )}

            {/* Pagination and Size Controls */}
            {(pageCount.length > 1 || posts.length > 0) && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  {/* Page Size Selector */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Posts per page:
                    </span>
                    <input
                      type="number"
                      name="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-center shadow-inner transition-colors"
                      min="1"
                      max="50"
                    />
                  </div>

                  {/* Pagination */}
                  {pageCount.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
                      >
                        Previous
                      </button>

                      <div className="hidden sm:flex space-x-2">
                        {pageCount.map((pageNumber, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(pageNumber)}
                            disabled={currentPage === pageNumber}
                            className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium ${
                              currentPage === pageNumber
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30"
                                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPage}
                        onClick={handleNext}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
