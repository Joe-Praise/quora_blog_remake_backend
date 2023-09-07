const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    authorId: {type:Schema.Types.ObjectId, ref: "user"},
    content:{type:String, required:true},
    image:{type:String, required: false},
    space:{type: String, required: false}
}, {timestamps:true})

const post = mongoose.model("post", postSchema);
module.exports = post;