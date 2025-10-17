import { useState } from "react"
import loginValidator from "../../validators/loginValidator"
import axios from "../../utils/axiosInstance"
import { toast } from "react-toastify"
import { useNavigate,Link } from "react-router-dom"


const Login =()=>{
    const InitialFormData={email:"",password:""}
    const InitialFormError={email:"",password:""}
    const [load,setLoad]=useState(false)
    const [formData,setFormData]=useState(InitialFormData)
    const [formError,setFormError] =useState(InitialFormError)
    const navigate= useNavigate()
    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const errors= loginValidator({
            email:formData.email,
            password:formData.password
        })||{email:"",password:""}
        if(errors.email||errors.password){
            setFormError(errors)
        }else{
            try{
                setLoad(true)
                const response= await axios.post("/auth/signin",formData)
                const data=response.data
                window.localStorage.setItem("blogData",JSON.stringify(data.data))
                console.log(data)
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setFormData(InitialFormData)
                setFormError(InitialFormError)

                navigate("/")
                setLoad(false)
            }catch(error){
                setLoad(false)
                const response= error.response
                const data=response.data
                toast.error(data.message,{
                    position:"top-right",
                    autoClose:true
                })

            }
        }
    }
    return (
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Log in Form</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="******"
              value={formData.password}
              onChange={handleChange}
            />
            {formError.password && (
              <p className="error">{formError.password}</p>
            )}
          </div>
          <Link className="forgot-password" to="/forgot-password">
            forgot Password
          </Link>
          <div>
            <input
              type="submit"
              className="button"
              value={`${load ? "logging in..." : "Login"} `}
            />
          </div>
        </form>
      </div>
    );
}

export default Login