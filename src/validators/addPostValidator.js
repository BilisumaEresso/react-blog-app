const addPostValidator=({title,category})=>{
    const errors={title:"",category:""}
    if(!title){
        errors.title="title required"
    }
    else if(!category){
        errors.category="select category"
    }
    return errors
}

export default addPostValidator