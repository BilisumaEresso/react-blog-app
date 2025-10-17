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
        // api request
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
      const data = response.data.data
      console.log("response.data:", response.data);
      console.log("data:", data);
      setUsers(data.user)
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
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="button button-block"
      >
        Go back
      </button>
      <h2 className="table-title">User list</h2>
      <input
        className="search-input"
        type="text"
        value={search}
        onChange={handleSearch}
        name="search"
        placeholder="Search here"
      />

      {load ? (
        <div>"Loading..."</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>{moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>
                  
                  <button
                  disabled={user.role===1}
                    onClick={() => {
                      if(user.role == 2){
     
                        handleDelete(user._id)
                      }else{
                        handleAdd(user._id);
                      }
                        
                    }}
                    className="button"
                  >
                    {user.role===1?"Super Admin":user.role===2?"Remove":"Add"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {pageCount.length > 1 && (
        <div className="pag-container">
          <button
            disabled={currentPage === 1}
            onClick={handlePrev}
            className="pag-button"
          >
            prev
          </button>
          {pageCount.map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(pageNumber)}
              disabled={pageNumber === currentPage}
              style={{
                backgroundColor: currentPage === pageNumber ? "#ccc" : "",
              }}
              className="pag-button"
            >
              {pageNumber}
            </button>
          ))}
          <button
            disabled={currentPage === totalPage}
            onClick={handleNext}
            className="pag-button"
          >
            next
          </button>
        </div>
      )}
      <label>Size</label>
      <input
        style={{ width: "50px" }}
        type="number"
        name="size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
    </div>
  );
};

export default ManageAdmin;
