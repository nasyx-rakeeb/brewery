import mongoose from "mongoose";

// mongoose.connect("mongodb://localhost:27017/brewery")
// .then(() =>{
//     console.log("mongodb connected")
// })
// .catch(() => {
//     console.log("failed to connect")
// })

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('LogInCollection',logInSchema)

export default LogInCollection;