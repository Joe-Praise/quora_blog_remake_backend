let multer = require("multer");
let fs = require("fs");
let path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let __dir = path.join(__dirname, "../public/uploads");
    cb(null, __dir);
  },
  filename: function (req, file, cb) {
    let filename = file.originalname.toLowerCase();
    cb(null, filename);
  },
});
let upload = multer({ storage });

module.exports = upload;
