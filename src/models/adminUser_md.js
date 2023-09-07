const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    image: {
      type: String, required: false, default: 'head.webp'
    },
    position:{type:String, required: true},
    department:{type:String, required: true},
    bio:{type:String, required: true, default: "I am an annonymous individual that loves my job so much, i became an admin.😂"},
    phone:{type:String, required: true},
    address: {type:String, required: true}
},{timestamps:true});

const adminUser = mongoose.model("adminUser", adminUserSchema);
module.exports = adminUser;