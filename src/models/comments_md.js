const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId:{type:String, required: true},   
    authorId:{type:Schema.Types.ObjectId, ref: "user"},
    content:{type:String, required: true},
},{timestamps:true})

const comment = mongoose.model("comments", commentSchema);
module.exports = comment;