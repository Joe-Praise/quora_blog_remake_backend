const userModel = require("./../src/models/user_md");
const bcrypt = require("bcryptjs");
const jwt = require("./../src/config/jwt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length < 0 && password.length < 0) {
      return;
    }

    userModel.findOne({ email }).then((user) => {
      if (!user) {
        return;
      }
      const passOk = bcrypt.compareSync(password, user.password);
      if (passOk) {
        // logged in with json webtoken
        jwt.sign(
          {
            name: user.name,
            image: user.image,
            id: user._id,
          },
          process.env.USER_SECRET,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie("User_token", token, {
                sameSite: "none",
                secure: true,
                httpOnly: true,
              })
              .json({ message: "User credentials ok", redirect: "/" });
          }
        );
      } else {
        res
          .status(400)
          .send({ message: "wrong credentials", redirect: "/login" });
      }
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("User_token").json({ redirect: "/login" });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { User_token } = req.cookies;

    if (User_token === undefined) {
      res.json({ err: "Login to have access!", redirect: "/login" });
    } else {
      jwt.verify(User_token, process.env.USER_SECRET, {}, (err, info) => {
        if (err) res.json({ err: err, redirect: "/login" });
        userModel
          .find(
            { _id: info.id },
            { name: true, image: true, _id: true, email: true }
          )
          .then((data) => {
            res.json(data);
          });
      });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};
