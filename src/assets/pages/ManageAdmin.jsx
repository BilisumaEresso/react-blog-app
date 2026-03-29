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
  const [selectedUsers, setSelectedUsers] = useState([]);

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
    setSelectedUsers([]); // Clear selections when page changes to avoid confusion
  }, [currentPage, search]);

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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const modifiableUsers = users.filter((u) => u.role !== 1).map((u) => u._id);
      setSelectedUsers(modifiableUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    try {
      setLoad(true);
      const endpoint = action === "add" ? "/auth/manage-admin/add/" : "/auth/manage-admin/remove/";
      await Promise.all(selectedUsers.map((id) => axios.put(`${endpoint}${id}`)));
      toast.success(
        `Selected users successfully ${action === "add" ? "made admins" : "removed from admins"}`,
        { position: "top-right", autoClose: true }
      );
      setSelectedUsers([]);
      // Reload current page
      const response = await axios.get(
        `/auth/manage-admin?page=${currentPage}&size=${size}&q=${search}`
      );
      const data = response.data.data;
      setUsers(data.user);
      setTotalPage(data.pages);
    } catch (error) {
      toast.error("Error updating some users. They might be super admins.", {
        position: "top-right",
        autoClose: true,
      });
    } finally {
      setLoad(false);
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
                Manage Admins
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage user roles and permissions</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="group bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 font-medium border border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md flex items-center space-x-2"
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

        {/* Search & Bulk Actions Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-300 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Users
            </label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-xl focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 transition-all duration-200 bg-white dark:bg-gray-800 flex items-center px-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                name="search"
                className="w-full px-3 py-3 border-none focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800/30 animate-fade-in-up">
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-300 mr-2">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={() => handleBulkAction("add")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors text-sm font-medium shadow-sm"
              >
                Make Admins
              </button>
              <button
                onClick={() => handleBulkAction("remove")}
                className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors text-sm font-medium shadow-sm"
              >
                Remove Admins
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Users Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 w-4 h-4"
                          onChange={handleSelectAll}
                          checked={
                            users.length > 0 &&
                            users.filter((u) => u.role !== 1).length > 0 &&
                            selectedUsers.length === users.filter((u) => u.role !== 1).length
                          }
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {users.map((user) => {
                      const roleBadge = getRoleBadge(user.role);
                      return (
                        <tr
                          key={user._id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                            selectedUsers.includes(user._id) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 w-4 h-4 disabled:opacity-50"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleSelectUser(user._id)}
                              disabled={user.role === 1}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium ${roleBadge.color}`}
                            >
                              {roleBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {moment(user.createdAt).format("MMM D, YYYY")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role === 1 ? (
                              <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                                Cannot modify
                              </span>
                            ) : user.role === 2 ? (
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors text-xs font-semibold"
                              >
                                Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAdd(user._id)}
                                className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors text-xs font-semibold"
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
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No users found matching your search.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination and Size Controls */}
            {(pageCount.length > 1 || users.length > 0) && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  {/* Page Size Selector */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Users per page:
                    </span>
                    <input
                      type="number"
                      name="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-center transition-colors"
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

export default ManageAdmin;
