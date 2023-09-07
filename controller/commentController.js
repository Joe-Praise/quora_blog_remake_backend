const commentModel = require("./../src/models/comments_md");
const jwt = require("./../src/config/jwt");

exports.createComment = (req, res) => {
  const { User_token } = req.cookies;
  try {
    jwt.verify(User_token, process.env.USER_SECRET, {}, async (err, info) => {
      if (err) return res.status(500).send({ message: "wrong credentials" });

      const payload = {
        authorId: info.id,
        postId: req.params.id,
        content: req.body.content,
      };
      const data = new commentModel(payload);
      await data.save();
      res.json({ success: true, message: "Comment created!" });
    });
  } catch (err) {
    res.send({ error: true, message: err.messasge });
  }
};

exports.getComment = (req, res) => {
  commentModel
    .find({ postId: req.params.id })
    .populate("authorId", ["image", "name"])
    .sort({ createdAt: -1 })
    .lean()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ error: true, messasge: err.message });
    });
};

exports.deleteComment = (req, res) => {
  commentModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.send({ success: true, message: "Comment Deleted" });
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};
