import Home from "./assets/pages/Home"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import NewCategory from "./assets/pages/category/NewCategory"
import UpdateCategory from "./assets/pages/category/UpdateCategory"
import CategoryList from '../src/assets/pages/category/CategoryList'
import PostList from '../src/assets/pages/post/PostList'
import NewPost from "../src/assets/pages/post/NewPost"
import DetailPost from "../src/assets/pages/post/DetailPost"
import UpdatePost from "../src/assets/pages/post/UpdatePost"
import Profile from '../src/assets/pages/Profile'
import Login from '../src/assets/pages/Login'
import Setting from '../src/assets/pages/Setting'
import Signup from '../src/assets/pages/Signup'
import {Route,Routes} from 'react-router-dom'
import PrivateLayout from "./components/layout/PrivateLayout"
import PublicLayout from "./components/layout/PublicLayout"
import VerifyUser from "../src/assets/pages/VerifyUser"
import ForgotPassword from "../src/assets/pages/ForgotPassword"
import ManageAdmin from "./assets/pages/ManageAdmin"
import PuzzleGame from "./assets/pages/PuzzleGame"




function App() {
 return (
   <div className="bg-gray-50 dark:bg-[#0B0E14] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-500 selection:bg-blue-500/30 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
     {/* Premium Animated Background Layer */}
     <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
       <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300/40 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
       <div className="absolute top-[20%] right-[-10%] w-[32rem] h-[32rem] bg-indigo-300/40 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
       <div className="absolute bottom-[-20%] left-[10%] w-[40rem] h-[40rem] bg-blue-300/40 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
     </div>
     
     <div className="relative z-10 w-full min-h-screen">
       <Routes>
       <Route element={<PrivateLayout />}>
         <Route path="/" element={<Home />} />
         <Route path="/auth/manage-admin" element={<ManageAdmin />} />
         <Route path="/categories" element={<CategoryList />} />
         <Route path="categories/new-category" element={<NewCategory />} />
         <Route
           path="categories/update-category/:id"
           element={<UpdateCategory />}
         />
         <Route path="/posts" element={<PostList />} />
         <Route path="posts/new-post" element={<NewPost />} />
         <Route path="posts/detail-post/:id" element={<DetailPost />} />
         <Route path="posts/update-post/:id" element={<UpdatePost />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/setting" element={<Setting />} />
         <Route path="/verify-user" element={<VerifyUser />} />
         <Route path="/logout" element={<Home />} />
         <Route path="/puzzle" element={<PuzzleGame />} />
       </Route>
       <Route element={<PublicLayout />}>
         <Route path="/login" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/signup" element={<Signup />} />
       </Route>
       </Routes>
       <ToastContainer
         theme="colored"
         toastClassName="!rounded-2xl !bg-white/80 dark:!bg-gray-900/80 !backdrop-blur-xl !shadow-2xl border border-white/20 dark:border-white/10"
         position="bottom-right"
       />
     </div>
   </div>
 );
}

export default App
