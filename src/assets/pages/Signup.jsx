import { useState } from "react"
import signupValidator from "../../validators/SignupValidator"
import axios from "../../utils/axiosInstance"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const Signup=()=>{
    const InitialFormData={
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    }
    const InitialFormError={name:"",email:"",password:"",confirmPassword:""}

    const [load,setLoad]=useState(false)
    const [formData,setFormData]=useState(InitialFormData)
    const [formError,setFormError]=useState(InitialFormError)
    const navigate=useNavigate()

    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        console.log("Submitting...") // Add this line
        const errors = signupValidator({
            name:formData.name,
            email:formData.email,
            password:formData.password,
            confirmPassword:formData.confirmPassword
        }) || {name:"",email:"",password:"",confirmPassword:""} // fallback
        if(errors.name || errors.email || errors.password || errors.confirmPassword){
            setFormError(errors)
        }else {
            try{
                const requestBody={
                    name:formData.name,
                    email:formData.email,
                    password:formData.password
                }
                setLoad(true)
               const response= await axios.post("/auth/signup",requestBody)
               const data=response.data
               toast.success(data.message,{
                position:"top-right",
                autoClose:true
               })
               setFormData(InitialFormData)
               setFormError(InitialFormError)
                // api request
                setLoad(false)
                navigate("/login")
            }catch(error){
                setLoad(false)
                const response=error.response
                const data=response.data
                 toast.error(data.message,{
                position:"top-right",
                autoClose:true
               })
            }
            
        }
        console.log(formData)
    }

    return (
        <div className="form-container">
            <form className="inner-container" onSubmit={handleSubmit}>
                <h2 className="form-title">Sign Up Form</h2>
                <div className="form-group">
                    <label>Name</label>
                    <input className="form-control" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                    {formError.name&&<p className="error">{formError.name}</p>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" name="email" placeholder="doe@gmail.com" value={formData.email} onChange={handleChange} />
                    {formError.email && <p className="error">{formError.email}</p>}
                </div>
                <div className="form-group">
                    <label >Password</label>
                    <input className="form-control" type="password" name="password" placeholder="******" value={formData.password} onChange={handleChange} />
                    {formError.password && <p className="error">{formError.password}</p>}
                </div>
                <div className="form-group">
                    <label >Confirm Password</label>
                    <input className="form-control" type="password" name="confirmPassword" placeholder="******" value={formData.confirmPassword} onChange={handleChange} />
                    {formError.confirmPassword && <p className="error">{formError.confirmPassword}</p>}
                </div>
                <div>
                    <input type="submit" className="button" value={`${load?"Saving...":"Signup"} `}/>
                </div>
            </form>
        </div>
    )
}

export default Signup