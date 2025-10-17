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
  useEffect(() => {
    
    
    const getPostList = async () => {
      try {
        setLoad(true);
        // api request
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
  console.log(pageCount);
  console.log(totalPage);

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
    <div>
      <h2 className="table-title">Post list</h2>
      <button hidden={auth.role===3} className="button button-block" onClick={()=> navigate("auth/manage-admin")} >Manage Admins</button>
      <input
        onChange={handleSearch}
        value={search}
        type="text"
        name="search"
        className="search-input"
        placeholder="search here"
      />

      {load ? (
        <div>Loading...</div>
      ) : (
        <div className="flexbox-container wrap">
          {posts.map((post) => (
            <div
              onClick={() => navigate(`/posts/detail-post/${post._id}`)}
              key={post._id}
              className="post-card"
            >
              <h4 className="card-title">{post.title}</h4>
              <p className="card-desc">{post.desc.substring(0, 50)}</p>
            </div>
          ))}
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
                  onClick={() => setCurrentPage(pageNumber)}
                  key={index}
                  disabled={currentPage === pageNumber}
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
          <div className="form-group">
            <label>Size</label>
            <input
              style={{ width: "50px" }}
              type="number"
              name="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
