const userModel = require("../src/models/user_md");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.send({ error: true, message: "Email already exists" });
      } else {
        userModel
          .create({ name, email, password: bcrypt.hashSync(password, salt) })
          .then((user) => {
            res.send({ sucess: true, data: user, message: "Account Created!" });
          })
          .catch((err) => {
            console.log(err);
            return res.send({ error: true, message: err.message });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send({ error: true, message: err.message });
    });
};

exports.getAllUsers = (req, res) => {
  userModel
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

exports.getUser = (req, res) => {
  userModel
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

exports.getRandomProfile = async (req, res) => {
  try {
    const user = await userModel.find(
      { _id: req.params.id },
      { password: false, lastLogin: false, updatedAt: false }
    );

    res.json({ data: user });
  } catch (err) {
    res.json({ error: ture, message: "Could not find posts for this sapce" });
  }
};

exports.updateUser = (req, res) => {
  if (req.files.length > 0) {
    req.body.image = req.files[0].filename;
  }
  userModel
    .findByIdAndUpdate(req.body.id, req.body)
    .then(() => {
      userModel
        .findById(req.body.id)
        .lean()
        .then((user) => {
          res.send({ success: true, data: user });
        })
        .catch((err) => {
          console.log(err);
          return res.send({ error: true, message: err.message });
        });
    })
    .catch((err) => {
      return res.send({ error: true, message: err.message });
    });
};

exports.deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);

    await postModel.deleteMany({ authorId: req.params.id });

    await reactionModel.deleteMany({
      authorId: req.params.id,
    });

    await followingModel.deleteMany({
      follower: req.params.id,
    });

    await commentModel.deleteMany({
      authorId: req.params.id,
    });

    res.send({ success: true, message: "User Deleted" });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
};
