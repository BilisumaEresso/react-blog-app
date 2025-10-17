const verificationCodeValidator=({code})=>{
    const errors={
        code:""
    }
    if(!code){
        errors.code="code is required"
    }else if(code.length<6||code.length>6){
        errors.code="wrong code length"
    }
    return errors
}

export default verificationCodeValidator