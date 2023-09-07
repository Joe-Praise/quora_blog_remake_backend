const userModel = require("../src/models/user_md");
const postModel = require("../src/models/post_md");
const reactionModel = require("../src/models/reactions_md");
const commentModel = require("../src/models/comments_md");

exports.getSpacePosts = async (req, res) => {
  try {
    const PostPayload = [];
    const spacePosts = await postModel.find({ space: req.params.category });
    for (let i = 0; i < spacePosts.length; i++) {
      const post = spacePosts[i];
      const payload = {};

      const user = await userModel.find(
        { _id: post.authorId },
        { password: false }
      );
      const likes = await reactionModel
        .find({ postId: post._id, like: true })
        .count();
      const dislikes = await reactionModel
        .find({ postId: post._id, dislike: true })
        .count();

      const comments = await commentModel
        .find({ postId: post._id })
        .populate("authorId", ["image", "name"])
        .sort({ createdAt: -1 })
        .lean();
      payload._id = post._id;
      payload.authorId = user[0];
      payload.content = post.content;
      payload.image = post.image;
      payload.space = post.space;
      payload.createdAt = post.createdAt;
      payload.updatedAt = post.updatedAt;
      payload.likes = likes;
      payload.dislikes = dislikes;
      payload.comments = [...comments];
      PostPayload.unshift(payload);
    }

    res.json({ succsess: true, data: PostPayload });
  } catch (err) {
    res.json({ error: ture, message: "Could not find posts for this sapce" });
  }
};
