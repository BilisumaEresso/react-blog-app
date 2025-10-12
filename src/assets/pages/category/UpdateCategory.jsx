import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import addCategoryValidator from "../../../validators/addCategoryValidator";

const UpdateCategory = () => {
  
    const params=useParams()
    const categoryId=params.id


  const InitialFormData = { title: "", desc: "" };
  const InitialFormError = { title: "" };
  const [formData, setFormData] = useState(InitialFormData);
  const [formError, setFormError] = useState(InitialFormError);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addCategoryValidator({ title: formData.title }) || {
      title: "",
    };
    if (errors.title) {
      setFormError(errors);
    } else {
      try {
        setLoad(true);
        const response = await axios.put(`/category/${categoryId}`, formData);
        const data = response.data;
        console.log(data);
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(InitialFormData);
        setFormError(InitialFormError);

        navigate("/categories");
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
          <h2 className="form-title">Update Category</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="Technology"
              onChange={handleChange}
            />
            {formError.title && <p>{formError.title}</p>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="desc"
              placeholder="lorem ipsum"
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value={load ? "Updating" : "Update"}
              className="button"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
