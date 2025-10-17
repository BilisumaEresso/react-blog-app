const resetPasswordValidator=({code,password})=>{
   const errors={
    code:"",
    password:""
   }
   if(!code){
    errors.code="code is required"
   }else if(code.length<6||code.length>6){
    errors.code="wrong code length"
   }if(!password){
    errors.password="password is required"
   }else if(password.length<6){
    errors.password="your password is short"
   }
   return errors
}

export default resetPasswordValidator