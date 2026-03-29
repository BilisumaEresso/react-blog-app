import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import moment from "moment";

const CategoryList = () => {
  const [load, setLoad] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `/category?page=${currentPage}&size=${size}&q=${search}`
        );
        const data = response.data.data;
        setCategories(data.category);
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

    getCategoryList();
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/category/${categoryId}`);
      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      const response2 = await axios.get(
        `/category?page=${currentPage}&size=${size}`
      );
      const data2 = response2.data.data;
      setCategories(data2.category);
      setTotalPage(data2.pages);
      setCategoryId(null);
      setShowModal(false);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
      setShowModal(false);
    }
  };

  const handleSearch = async (e) => {
    const input = e.target.value;
    setSearch(input);
    try {
      const response = await axios.get(
        `/category?page=${currentPage}&q=${input}&size=${size}`
      );
      const data = response.data;
      setCategories(data.category);
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 p-8 mb-8 shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
                Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage your blog categories
              </p>
            </div>
            <button
              onClick={() => navigate("new-category")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 whitespace-nowrap flex items-center space-x-2 group"
            >
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 mb-8 shadow-sm transition-colors duration-300">
          <div className="max-w-xl">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Search Categories
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                name="search"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 shadow-inner"
                placeholder="Search by category name..."
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 p-12 text-center animate-pulse transition-colors duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Categories Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden transition-colors duration-300">
              <div className="overflow-x-auto">
                {/* Desktop Table View */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 hidden md:table">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {categories.map((category) => (
                      <tr
                        key={category._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {category.title}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {category.desc}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {moment(category.createdAt).format("MMM DD, YYYY")}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {moment(category.updatedAt).format("MMM DD, YYYY")}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => navigate(`update-category/${category._id}`)}
                              className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setCategoryId(category._id);
                                setShowModal(true);
                              }}
                              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile & Tablet Card View */}
                <div className="md:hidden p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {/* Header with Title and Actions */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {category.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`update-category/${category._id}`)}
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            aria-label="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setCategoryId(category._id);
                              setShowModal(true);
                            }}
                            className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                            aria-label="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {category.desc}
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Created</span>
                          <span className="text-gray-600 dark:text-gray-400">{moment(category.createdAt).format("MMM D, YYYY")}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Updated</span>
                          <span className="text-gray-600 dark:text-gray-400">{moment(category.updatedAt).format("MMM D, YYYY")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* No Categories Message */}
              {categories.length === 0 && !load && (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Categories Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Try adjusting your search or create a new category to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pageCount.length > 1 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Items per page:
                    </span>
                    <input
                      type="number"
                      name="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-center font-medium shadow-inner transition-colors duration-300"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={handlePrev}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border-none rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm text-sm font-semibold"
                    >
                      Prev
                    </button>

                    <div className="flex space-x-1">
                      {pageCount.map((pageNumber, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNumber)}
                          disabled={currentPage === pageNumber}
                          className={`w-10 h-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm font-bold shadow-sm ${
                            currentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === totalPage}
                      onClick={handleNext}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border-none rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm text-sm font-semibold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden text-center align-middle transition-all transform scale-100">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center text-gray-900 dark:text-white">
                <h3 className="text-xl font-bold">Confirm Deletion</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCategoryId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-8 bg-white dark:bg-gray-900 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-2 font-bold">
                  Delete this category?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone and will affect all posts associated with it.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex space-x-4 w-full justify-center">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCategoryId(null);
                  }}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 border border-gray-300 dark:border-gray-600 font-semibold shadow-sm transition-all focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 focus:ring-2 focus:ring-red-500 border-none font-bold shadow-md shadow-red-500/20 transition-all focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
