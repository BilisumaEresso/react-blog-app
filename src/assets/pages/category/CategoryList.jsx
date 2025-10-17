import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import moment from "moment";
import { Modal,Button } from "react-bootstrap";

const CategoryList = () => {
  const [load, setLoad] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [size,setSize]=useState(10)
  const [search,setSearch]=useState("")
  const [showModal,setShowModal]=useState(false)
  const [categoryId,setCategoryId]=useState(null)

  

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        setLoad(true);
        // api request
        const response = await axios.get(`/category?page=${currentPage}&size=${size}&q=${search}`);
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
  }, [currentPage,size,search]);
  
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


  const handleDelete=async()=>{
    try{
      const response=await axios.delete(`/category/${categoryId}`)
      const data=response.data
      toast.success(data.message,{
        position:"top-right",
        autoClose:true
      })
       const response2 = await axios.get(
         `/category?page=${currentPage}&size=${size}`
       );
       const data2 = response2.data.data;
       setCategories(data2.category);
       setTotalPage(data2.pages);
      setCategoryId(null)
      setShowModal(false)
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
      setShowModal(false)
    }
  }

  const handleSearch = async(e) => {
    const input=e.target.value
    setSearch(input)
   try{
      const response= await axios.get(`/category?page=${currentPage}&q=${input}&size=${size}`)
      const data=response.data
      setCategories(data.category)
      setTotalPage(data.pages)
   }catch(error){
     const response = error.response;
     const data = response.data;
    toast.error(data.message, {
      position: "top-right",
      autoClose: true,
    });
   }
  };

  const handlePrev=()=>{
    setCurrentPage((prev)=>prev-1)
  }

  const handleNext=()=>{
    setCurrentPage((prev)=>prev+1)
  }

  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navigate("new-category");
        }}
        className="button button-block"
      >
        Add new Category
      </button>
      <h2 className="table-title">Category list</h2>
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
              <th>Title</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.title}</td>
                <td>{category.desc}</td>
                <td>
                  {moment(category.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td>
                  {moment(category.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <th>
                  <button
                    onClick={() => {
                      navigate(`update-category/${category._id}`);
                    }}
                    className="button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setCategoryId(category._id);
                      setShowModal(true);
                    }}
                    className="button"
                  >
                    Delete
                  </button>
                </th>
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
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCategoryId(null);
        }}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>Are you sure you want to delete ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <div style={{ margin: "0 auto" }}>
            <Button
              onClick={() => {
                setShowModal(false);
                setCategoryId(null);
              }}
              className="no-button"
            >
              No
            </Button>
            <Button onClick={handleDelete} className="yes-button">
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryList;
