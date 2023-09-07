const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    image: {
      type: String, required: false, default: 'head.webp'
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
