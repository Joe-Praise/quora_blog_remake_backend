const reactionModel = require("./../src/models/reactions_md");

exports.createReaction = (req, res) => {
  const { User_token } = req.cookies;
  try {
    jwt.verify(User_token, process.env.USER_SECRET, {}, async (err, info) => {
      if (err) return res.send({ message: "Could not create a reaction" });
      reactionModel
        .findOne({ authorId: info.id, postId: req.params.id })
        .then((user) => {
          if (!user) {
            const payload = {
              authorId: info.id,
              postId: req.params.id,
              like: req.body.like,
              dislike: req.body.dislike,
            };
            reactionModel.create(payload).then((user) => {
              res.send({
                message: "Reaction Successfully Created",
                data: user,
              });
            });
          } else {
            if (
              (req.body.like && user.like) ||
              (req.body.dislike && user.dislike)
            ) {
              reactionModel.findByIdAndDelete(user._id).then((data) => {
                res.send({ message: "Reaction Successfully Deleted", data });
              });
            } else {
              reactionModel.findByIdAndUpdate(user._id, req.body).then(() => {
                postModel
                  .findById(req.body.id)
                  .lean()
                  .then((user) => {
                    res.send({
                      message: "Reaction Successfully Updated",
                      data: user,
                    });
                  });
              });
            }
          }
        });
    });
  } catch (err) {
    res.send({ error: true, message: err.messasge });
  }
};

exports.getLikes = (req, res) => {
  reactionModel
    .find({ postId: req.params.id, like: true })
    .count()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};

exports.getUnlike = (req, res) => {
  reactionModel
    .find({ postId: req.params.id, dislike: true })
    .count()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};
