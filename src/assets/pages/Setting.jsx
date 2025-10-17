import { useNavigate } from "react-router-dom"
import { useState } from "react";
import changgePasswordValidator from "../../validators/changePasswordValidator";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const Setting=()=>{

    const InitialFormData = {
      newPassword: "",
    oldPassword:""
        
    };
    const InitialFormError = {
      newPassword: "",
      oldPassword: "",
    };

    const [load, setLoad] = useState(false);
    const [formData, setFormData] = useState(InitialFormData);
    const [formError, setFormError] = useState(InitialFormError);

    const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitting..."); // Add this line
      const errors = changgePasswordValidator({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }) || { oldPassword: "", newPassword: "" }; // fallback
      if (
        errors.oldPassword ||
        errors.newPassword 
      
      ) {
        setFormError(errors);
      } else {
        try {
          const requestBody = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          };
          setLoad(true);
          const response = await axios.put("/auth/change-password", requestBody);
          const data = response.data;
          console.log(data.message)
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
    

    const navigate=useNavigate()
    return (
      <div>
        <button onClick={() => navigate(-1)} className="button button-block">
          Go back
        </button>
        <button
          onClick={() =>
            
            navigate("/verify-user")}
          className="button button-block"
        >
          Verify user
        </button>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="inner-container">
            <h2 className="form-title">Change password</h2>
            <div className="form-group">
              <label>Old Password</label>
              <input
                className="form-control"
                type="password"
                name="oldPassword"
                placeholder="******"
                value={formData.oldPassword}
                onChange={handleChange}
              />
              {formError.oldPassword && (
                <p className="error">{formError.oldPassword}</p>
              )}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                className="form-control"
                type="password"
                name="newPassword"
                placeholder="******"
                value={formData.newPassword}
                onChange={handleChange}
              />
              {formError.newPassword && (
                <p className="error">{formError.newPassword}</p>
              )}
            </div>
            <input className="button" type="submit" value={load?"Changing..":"CHange Password"} />
          </form>
        </div>
      </div>
    );
}

export default Setting