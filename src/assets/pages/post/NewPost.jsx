import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import addPostValidator from "../../../validators/addPostValidator";
import { useState, useEffect } from "react";

const NewPost = () => {
  const InitialFormData = { title: "", desc: "", category: "" };
  const InitialFormError = { title: "", category: "" };
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);
  const [categories, setCategories] = useState([]);
  const [extensionError,setExtensionError]=useState(null)
  const [fileId,setFileId]=useState(null)
  const [isDisabled,setIsDisabled]=useState(false)
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(formData);

  const handleChangeFile=async(e)=>{
    console.log(e.target.files)
    const formInput= new FormData()
    formInput.append("image",e.target.files[0])
    const type = e.target.files[0].type
    if(type==="image/png"||type==="image/jpg"||type==="image/jpeg"){

      setExtensionError(null)
      try {
        setIsDisabled(true)
        const response = await axios.post("/file/upload", formInput);
        const data = response.data;
        setFileId(data.data._id)
        console.log(data);
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setIsDisabled(false)
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }else{
        setIsDisabled(true)
      setExtensionError("only png or jpg or jpeg file is allowed")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addPostValidator({
      title: formData.title,
      category: formData.category,
    }) || {
      title: "",
      category: "",
    };
    if (errors.title) {
      setFormError(errors);
    } else if (errors.category) {
      setFormError(errors);
    } else {
      try {
        setLoad(true);

        let input=formData
        if(fileId){
          input={...input,file:fileId}
        }

        const response = await axios.post("/post", input);
        const data = response.data;
        console.log(data);
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(InitialFormData);
        setFormError(InitialFormError);

        navigate("/posts");
        setLoad(false);
      } catch (error) {
        setLoad(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }
  };

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        // api request
        const response = await axios.get(`/category?size=${1000}`);
        const data = response.data.data;
        setCategories(data.category);
        setLoad(false);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    };

    getCategoryList();
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="button button-block"
      >
        Go Back
      </button>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="inner-container">
          <h2 className="form-title">New Post</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              onChange={handleChange}
              value={formData.title}
              type="text"
              name="title"
              placeholder="React"
              className="form-control"
            />
            {formError.title && <p className="error" >{formError.title}</p>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              onChange={handleChange}
              name="desc"
              value={formData.desc}
              placeholder="lorem ipsum"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input onChange={handleChangeFile} type="file" name="file" className="form-control" />
            {extensionError&&<p className="error" >{extensionError}</p>}
          </div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">select</option>
            {categories.map((category) => (
              <option key={categories._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          {formError.category && <p className="error" >{formError.category}</p>}
          <input disabled={isDisabled}
            className="button button-block"
            type="submit"
            value={load ? "Adding.." : "Add"}
          />
        </form>
      </div>
    </div>
  );
};

export default NewPost;
