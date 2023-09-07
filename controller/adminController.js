const userModel = require("../src/models/user_md");
const postModel = require("../src/models/post_md");
const reactionModel = require("../src/models/reactions_md");
const adminUserModel = require("../src/models/adminUser_md");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("./../src/config/jwt");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email.length < 0 && password.length < 0) {
      return;
    }

    adminUserModel.findOne({ email }).then((user) => {
      const passOk = bcrypt.compareSync(password, user.password);
      if (passOk) {
        // logged in with json webtoken
        jwt.sign(
          {
            name: user.name,
            image: user.image,
            id: user._id,
            position: user.position,
          },
          process.env.ADMIN_SECRET,
          {},
          (err, token) => {
            if (err)
              return res.status(500).send({
                message: "opps, something went wrong. Our bad!",
                redirect: "/adminlogout",
              });

            res
              .cookie("Admin_token", token, {
                sameSite: "none",
                secure: true,
                httpOnly: true,
              })
              .json({ message: "Admin credentials ok", redirect: "/admin" });
          }
        );
      } else {
        res.status(400).send({
          message: "wrong admin credentials",
          redirect: "/adminlogout",
        });
      }
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    res.clearCookie("Admin_token").json({ redirect: "/login" });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const { Admin_token } = req.cookies;
    if (Admin_token === undefined) {
      res.json({
        err: "Login as admin to have access!",
        redirect: "/login",
      });
    } else {
      jwt.verify(Admin_token, process.env.ADMIN_SECRET, {}, (err, info) => {
        if (err) return res.json({ err: err, redirect: "/adminlogin" });
        adminUserModel
          .find(
            { _id: info.id },
            {
              name: true,
              image: true,
              _id: true,
              email: true,
              position: true,
              department: true,
              address: true,
              phone: true,
              bio: true,
            }
          )
          .lean()
          .then((data) => {
            res.json(data);
          });
      });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

exports.createAdmin = async (req, res) => {
  const { name, email, password, position, department, address, phone } =
    req.body;
  adminUserModel.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.send({ error: true, message: "Email already exists" });
    } else {
      adminUserModel
        .create({
          name,
          email,
          password: bcrypt.hashSync(password, salt),
          position,
          department,
          address,
          phone,
        })
        .then((user) => {
          res.send({ sucess: true, data: user, message: "Account Created!" });
        })
        .catch((err) => {
          console.log(err);
          return res.send({ error: true, message: err.message });
        });
    }
  });
};

exports.getAllAdmin = (req, res) => {
  adminUserModel
    .find()
    .lean()
    .then((users) => {
      res.send({ success: true, data: users });
    })
    .catch((err) => {
      console.log(err);
      return res.send({ error: true, message: err.message });
    });
};

exports.getAdmin = (req, res) => {
  adminUserModel
    .findById(req.params.id)
    .lean()
    .then((user) => {
      res.send({ success: true, data: user });
    })
    .catch((err) => {
      console.log(err);
      return res.send({ error: true, message: err.messasge });
    });
};

exports.updateAdmin = (req, res) => {
  if (req.files.length > 0) {
    req.body.image = req.files[0].filename;
  }

  adminUserModel.findByIdAndUpdate(req.body.id, req.body).then(() => {
    adminUserModel
      .findById(req.body.id)
      .lean()
      .then((user) => {
        res.send({ success: true, data: user });
      })
      .catch((err) => {
        console.log(err);
        return res.send({ error: true, message: err.message });
      });
  });
};

exports.deleteAdmin = (req, res) => {
  adminUserModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.send({ success: true, message: "User Deleted" });
    })
    .catch((err) => {
      return res.send({ error: true, message: err.message });
    });
};

exports.getTotalUsers = (req, res) => {
  userModel
    .find()
    .count()
    .then((num) => {
      res.send({ data: num, message: "Total No. Of Users" });
    })
    .catch((err) => {
      console.log(err);
      return res.send({ error: true, message: err.message });
    });
};

exports.getTotalPosts = (req, res) => {
  postModel
    .find()
    .count()
    .then((num) => {
      res.send({ data: num, message: "Total No. Of Posts" });
    })
    .catch((err) => {
      console.log(err);
      return res.send({ error: true, message: err.message });
    });
};

exports.getTotalLikes = (req, res) => {
  reactionModel
    .find({ like: true })
    .count()
    .then((data) => {
      res.send({ data: data, message: "Total No. Of Likes" });
    });
};

exports.getTotalDislikes = (req, res) => {
  reactionModel
    .find({ dislike: true })
    .count()
    .then((data) => {
      res.send({ data: data, message: "Total No. Of Dislikes" });
    });
};
