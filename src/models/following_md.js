const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followingSchema = new Schema({
    follower: {type:Schema.Types.ObjectId, ref: "user"},
    followee: {type:Schema.Types.ObjectId, ref: "user"},
})

const following = mongoose.model("following", followingSchema);
module.exports = following;