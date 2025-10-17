const changePasswordValidator=({oldPassword,newPassword})=>{
    const errors={
        oldPassword:"",
        newPassword:""

    }
    if(!oldPassword){
        errors.oldPassword="old password required"
    }
    if(!newPassword){
        errors.newPassword="new password required"
    }else if(newPassword.length<6){
        errors.newPassword="password is too short"
    }else if(oldPassword&& oldPassword===newPassword){
        errors.newPassword="this password is similar to old one"
    }

return errors
}

export default changePasswordValidator