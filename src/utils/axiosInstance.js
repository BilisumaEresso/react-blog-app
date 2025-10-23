import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://blog-rest-api-1.onrender.com/api/v1"
});

axiosInstance.interceptors.request.use((req)=>{
    const stringifyblogData=window.localStorage.getItem("blogData")
    if(stringifyblogData){
        const blogData=JSON.parse(stringifyblogData)
        const token= blogData.token
        req.headers.Authorization=`Bearer ${token}`

    }
    return req
})

export default axiosInstance