const followingModel = require("./../src/models/following_md");
const jwt = require("./../src/config/jwt");

exports.createFollowing = async (req, res) => {
  try {
    const { follower } = req.body;
    if (follower.length < 1) {
      return null;
    }

    const { User_token } = req.cookies;
    jwt.verify(User_token, process.env.USER_SECRET, {}, async (err, info) => {
      if (err) return res.status(500).send({ message: "wrong credentials" });
      const payload = {
        follower,
        followee: req.params.id,
      };

      const following = await followingModel.findOne(payload);
      if (!following) {
        const createFollowing = new followingModel(payload);
        await createFollowing.save();
        res.json("Successfully followed the user");
      } else {
        await followingModel.findOneAndDelete(payload);
        res.json({
          message: "Successfully unfollowed the user",
        });
      }
    });
  } catch (err) {
    res.json({ error: ture, message: "Could not find posts for this sapce" });
  }
};

exports.getFollowing = (req, res) => {
  followingModel
    .find({ follower: req.params.id })
    .populate("followee", ["image", "name", "_id"])
    .sort({ createdAt: -1 })
    .lean()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};

exports.getFollowers = (req, res) => {
  followingModel
    .find({ followee: req.params.id })
    .populate("follower", ["image", "name", "_id"])
    .sort({ createdAt: -1 })
    .lean()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};
