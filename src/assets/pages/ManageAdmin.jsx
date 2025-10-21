import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import moment from "moment";

const ManageAdmin = () => {
  const [load, setLoad] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getUserList = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `/auth/manage-admin?page=${currentPage}&size=${size}&q=${search}`
        );
        const data = response.data.data;
        setUsers(data.user);
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

    getUserList();
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.put(`/auth/manage-admin/remove/${id}`);
      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      const response2 = await axios.get(
        `/auth/manage-admin?page=${currentPage}&size=${size}`
      );
      const data2 = response2.data.data;
      setUsers(data2.user);
      setTotalPage(data2.pages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  const handleAdd = async (id) => {
    try {
      const response = await axios.put(`/auth/manage-admin/add/${id}`);
      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      const response2 = await axios.get(
        `/auth/manage-admin?page=${currentPage}&size=${size}`
      );
      const data2 = response2.data.data;
      setUsers(data2.user);
      setTotalPage(data2.pages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  const handleSearch = async (e) => {
    const input = e.target.value;
    setSearch(input);
    try {
      const response = await axios.get(
        `/auth/manage-admin?page=${currentPage}&q=${input}&size=${size}`
      );
      const data = response.data.data;
      setUsers(data.user);
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

  const getRoleBadge = (role) => {
    const roleConfig = {
      1: {
        label: "Super Admin",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      2: { label: "Admin", color: "bg-blue-100 text-blue-800 border-blue-200" },
      3: { label: "User", color: "bg-gray-100 text-gray-800 border-gray-200" },
    };
    return roleConfig[role] || roleConfig[3];
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Manage Admins
              </h1>
              <p className="text-gray-600">Manage user roles and permissions</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="group bg-white text-gray-700 px-6 py-3 rounded-3 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium border border-gray-300 hover:border-blue-300 shadow-sm hover:shadow-md flex items-center space-x-2"
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

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="border border-gray-300 rounded-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                name="search"
                className="w-full px-4 py-3 border-none focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                placeholder="Search by name or email..."
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-600">Loading users...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => {
                      const roleBadge = getRoleBadge(user.role);
                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.color}`}
                            >
                              {roleBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {moment(user.createdAt).format("MMM D, YYYY")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role === 1 ? (
                              <span className="text-gray-400 text-sm">
                                Cannot modify
                              </span>
                            ) : user.role === 2 ? (
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors text-xs font-medium"
                              >
                                Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAdd(user._id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors text-xs font-medium"
                              >
                                Make Admin
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* No Users Message */}
              {users.length === 0 && !load && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No users found. Try a different search term.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination and Size Controls */}
            {(pageCount.length > 1 || users.length > 0) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  {/* Page Size Selector */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      Users per page:
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

                  {/* Pagination */}
                  {pageCount.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                        className="px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
                      >
                        Previous
                      </button>

                      {pageCount.map((pageNumber, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNumber)}
                          disabled={currentPage === pageNumber}
                          className={`px-4 py-2 border rounded-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium ${
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
                        className="px-4 py-2 border border-gray-300 rounded-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
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

export default ManageAdmin;
