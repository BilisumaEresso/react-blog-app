import Home from "./assets/pages/Home"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { ToastContainer } from "react-toastify"
import NewCategory from "./assets/pages/category/NewCategory"
import UpdateCategory from "./assets/pages/category/UpdateCategory"
import CategoryList from '../src/assets/pages/category/CategoryList'
import PostList from '../src/assets/pages/post/PostList'
import NewPost from "../src/assets/pages/post/NewPost"
import Detailpost from "../src/assets/pages/post/DetailPost"
import UpdatePost from "../src/assets/pages/post/UpdatePost"
import Profile from '../src/assets/pages/Profile'
import Login from '../src/assets/pages/Login'
import Setting from '../src/assets/pages/Setting'
import Signup from '../src/assets/pages/Signup'
import {Route,Routes} from 'react-router-dom'
import PrivateLayout from "./components/layout/PrivateLayout"
import PublicLayout from "./components/layout/PublicLayout"
import VerifyUser from "../src/assets/pages/VerifyUser"
import FogotPassword from "../src/assets/pages/ForgotPassword"
import ManageAdmin from "./assets/pages/ManageAdmin"




function App() {
 return (
  <>

  <Routes>
   <Route element={<PrivateLayout/>}>
     <Route path="/" element={<Home/>}/>
     <Route path="/auth/manage-admin" element={<ManageAdmin/>} />
     <Route path="/categories" element={<CategoryList/>}/>
     <Route path="categories/new-category" element={<NewCategory/>}/>
     <Route path="categories/update-category/:id" element={<UpdateCategory/>}/>
     <Route path="/posts" element={<PostList/>}/>
     <Route path="posts/new-post" element={<NewPost/>} />
     <Route path="posts/detail-post/:id" element={<Detailpost/>} />
     <Route path="posts/update-post/:id" element={<UpdatePost/>} />
     <Route path="/profile" element={<Profile/>}/>
     <Route path="/setting" element={<Setting/>}/>
     <Route path="/verify-user" element={<VerifyUser/>} />
     <Route path="/logout" element={<Home/>}/>
   </Route>
   <Route element={<PublicLayout/>}>
       <Route path="/login" element={<Login/>}/>
       <Route path="/forgot-password" element={<FogotPassword/>}/>
      <Route path="/signup" element={<Signup/>}/>
   </Route>
  </Routes>  
  <ToastContainer/>
  </>
      
  )
}

export default App
