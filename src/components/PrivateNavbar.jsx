import {NavLink, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from './context/AuthContext'

const PrivateNavbar=()=>{
    const auth=useAuth()
    const role=auth.role
    console.log(auth)
    const navigate=useNavigate()
    const handleLogout=()=>{
        window.localStorage.removeItem("blogData")
        toast.success("Logged out successfully!!",{
            position:"top-right",
            autoClose:true
        })
        navigate("/login")
    }
    return (
      <nav className="primary-link">
        <NavLink to="/">Home</NavLink>
        {(role === 1 ||
          role == 2) &&( <NavLink to="/categories">Categories</NavLink>)}
        <NavLink to="/posts">Posts</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/login" onClick={handleLogout}>
          Logout
        </NavLink>
        <NavLink to="/setting">Setting</NavLink>
      </nav>
    );
}

export default PrivateNavbar