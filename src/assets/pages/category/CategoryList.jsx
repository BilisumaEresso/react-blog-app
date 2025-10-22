import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-3 border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Categories
              </h1>
              <p className="text-gray-600">Manage your blog categories</p>
            </div>
            <button
              onClick={() => navigate("new-category")}
              className="bg-blue-600 text-white px-6 py-3 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium whitespace-nowrap"
            >
              Add New Category
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3 border border-gray-200 p-6 mb-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Categories
            </label>
            <div className="border border-gray-300 rounded-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                name="search"
                className="w-full px-4 py-3 border-none focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                placeholder="Search by category name..."
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white rounded-3 border border-gray-200 p-8 text-center">
            <div className="text-gray-600">Loading categories...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Categories Table */}
            <div className="bg-white rounded-3 border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {/* Desktop Table View */}
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr
                        key={category._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {category.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {category.desc}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {moment(category.createdAt).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {moment(category.updatedAt).format(
                              "YYYY-MM-DD HH:mm"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() =>
                                navigate(`update-category/${category._id}`)
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setCategoryId(category._id);
                                setShowModal(true);
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors text-xs font-medium"
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
                <div className="md:hidden p-4 space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-white border border-gray-200 rounded-3-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Header with Title and Actions */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.title}
                        </h3>
                        <div className="flex justify-between">
                          <button
                            onClick={() =>
                              navigate(`update-category/${category._id}`)
                            }
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-3  hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-blue-500 transition-colors text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCategoryId(category._id);
                              setShowModal(true);
                            }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.desc}
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium text-gray-700">
                            Created:
                          </span>
                          <br />
                          {moment(category.createdAt).format("MMM D, YYYY")}
                          <br />
                          <span className="text-gray-400">
                            {moment(category.createdAt).format("h:mm A")}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Updated:
                          </span>
                          <br />
                          {moment(category.updatedAt).format("MMM D, YYYY")}
                          <br />
                          <span className="text-gray-400">
                            {moment(category.updatedAt).format("h:mm A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* No Categories Message */}
              {categories.length === 0 && !load && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No categories found. Try a different search term or create a
                    new category.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pageCount.length > 1 && (
              <div className="bg-white rounded-3 border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      Items per page:
                    </span>
                    <input
                      type="number"
                      name="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 text-center"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={handlePrev}
                      className="px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                    >
                      Previous
                    </button>

                    {pageCount.map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(pageNumber)}
                        disabled={currentPage === pageNumber}
                        className={`px-4 py-2 border rounded-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPage}
                      onClick={handleNext}
                      className="px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
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
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setCategoryId(null);
          }}
          centered
        >
          <Modal.Header closeButton className="border-b border-gray-200">
            <Modal.Title className="text-lg font-semibold text-gray-900">
              Confirm Deletion
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-6">
            <p className="text-gray-700">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-t border-gray-200">
            <div className="flex space-x-3 w-full  justify-around">
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 border-0"
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                  setCategoryId(null);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-3 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 border-0"
              >
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
