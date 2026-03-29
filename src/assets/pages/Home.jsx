import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../components/context/AuthContext";
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
    <div className="min-h-[calc(100vh-64px)] py-12 transition-colors duration-300 relative z-10 w-full">
      {/* Header Section */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-16 mt-4">
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6 tracking-tighter drop-shadow-sm">
            Tech Blog App
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover amazing stories, insights, and connect with a community of exceptional writers.
          </p>
        </div>

        {/* Admin Management Button */}
        {auth.role !== 3 && (
          <div className="flex justify-center mb-12">
            <button
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-purple-700 dark:text-purple-400 px-8 py-4 rounded-2xl hover:bg-gradient-to-r from-purple-500 to-pink-600 hover:text-white dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold flex items-center gap-3 shadow-lg shadow-purple-500/10 border border-purple-200 dark:border-purple-800/50 group"
              onClick={() => navigate("auth/manage-admin")}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage System
            </button>
          </div>
        )}

        {/* Page Title & Search Bar Layout */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
          <div className="w-full md:w-auto bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-white/10 p-5 px-8 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-between transition-colors">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mr-4 tracking-tight">
              Latest Posts
            </h2>
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{posts.length} Posts</span>
          </div>

          <div className="w-full md:flex-1 max-w-2xl bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-white/10 p-3 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-colors">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                onChange={handleSearch}
                value={search}
                type="text"
                name="search"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-none rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner font-medium text-lg outline-none"
                placeholder="Search articles by title or keyword..."
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div key={k} className="bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] h-64 animate-pulse flex flex-col justify-between">
                <div>
                  <div className="h-8 bg-gray-200/80 dark:bg-gray-800/80 rounded-xl w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-800/80 rounded-lg w-full mb-3"></div>
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-800/80 rounded-lg w-5/6"></div>
                </div>
                <div className="h-5 bg-indigo-200/50 dark:bg-indigo-900/50 rounded-lg w-1/4 mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  onClick={() => navigate(`/posts/detail-post/${post._id}`)}
                  key={post._id}
                  className="bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer transition-all duration-300 group flex flex-col justify-between min-h-64"
                >
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600 transition-colors line-clamp-2 tracking-tight">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
                      {post.desc}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-bold group-hover:gap-2 transition-all uppercase tracking-wider">
                    <span>Read article</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* No Posts Message */}
            {posts.length === 0 && !load && (
              <div className="bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-12 text-center transition-colors shadow-xl">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800/50 mb-6 shadow-inner">
                  <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                  We couldn't find any stories matching your search.
                </p>
              </div>
            )}

            {/* Pagination & Size Match Pro Layout */}
            <div className="bg-white/70 dark:bg-[var(--color-dark-card)]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
              {/* Pagination */}
              {pageCount.length > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                    className="px-5 py-2.5 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-sm"
                  >
                    Previous
                  </button>

                  <div className="hidden sm:flex space-x-2">
                    {pageCount.map((pageNumber, index) => (
                      <button
                        onClick={() => setCurrentPage(pageNumber)}
                        key={index}
                        disabled={currentPage === pageNumber}
                        className={`px-5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border-none"
                            : "border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPage}
                    onClick={handleNext}
                    className="px-5 py-2.5 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-sm"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Page Size Selector */}
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-2xl px-5 py-2.5 border border-white/20 dark:border-white/10 shadow-sm">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Posts per page:
                </label>
                <input
                  type="number"
                  name="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-16 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-center font-bold shadow-inner"
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
