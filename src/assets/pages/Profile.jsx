import { useState } from "react";
import updateProfileValidator from "../../validators/updateProfileValidator";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const InitialFormData = {
      name: "",
      email: ""
    };
    const InitialFormError = {
      email: ""
    };

    const [load, setLoad] = useState(false);
    const [formData, setFormData] = useState(InitialFormData);
    const [formError, setFormError] = useState(InitialFormError);
    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitting..."); // Add this line
      const errors = updateProfileValidator({
        email: formData.email
       
      }) || {email: ""}; // fallback
      if (
        errors.email
      ) {
        setFormError(errors);
      } else {
        try {
          const requestBody = {
            name: formData.name,
            email: formData.email
          };
          setLoad(true);
          const response = await axios.put("/auth/update-profile", requestBody);
          const data = response.data;
          toast.success(data.message, {
            position: "top-right",
            autoClose: true,
          });
          setFormData(InitialFormData);
          setFormError(InitialFormError);
          // api request
          setLoad(false);
          window.localStorage.removeItem("blogData")
          navigate("/login");
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
      console.log(formData);
    };
  return( <div className="form-container">
            <form className="inner-container" onSubmit={handleSubmit}>
                <h2 className="form-title">Update profile</h2>
                <div className="form-group">
                    <label>Name</label>
                    <input className="form-control" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" name="email" placeholder="doe@gmail.com" value={formData.email} onChange={handleChange} />
                    {formError.email && <p className="error">{formError.email}</p>}
                </div>
                <div>
                    <input type="submit" className="button" value={`${load?"Saving...":"Update"} `}/>
                </div>
            </form>
        </div>
    )
};

export default Profile;
