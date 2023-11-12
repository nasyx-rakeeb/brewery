import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    rating:{
        type: String,
        enum: ["1", "2", "3","4", "5"]
    }
})

const ReviewCollection =new mongoose.model('ReviewCollection',reviewSchema)
export default ReviewCollection

