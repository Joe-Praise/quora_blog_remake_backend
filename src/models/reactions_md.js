const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    postId: {type:String, required: true},
    authorId:{type:Schema.Types.ObjectId, ref: 'user'},
    like:{type: Boolean},
    dislike: {type: Boolean}
})

const reaction = mongoose.model("reactions", reactionSchema);
module.exports = reaction;