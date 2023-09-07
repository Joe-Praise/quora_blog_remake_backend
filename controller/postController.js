const postModel = require('../src/models/post_md');
const jwt = require('../src/config/jwt');

exports.createPost = async (req, res) => {
  try {
    if (req.files.length > 0) {
      req.body.image = req.files[0].filename;
    }

    const { User_token } = req.cookies;
    jwt.verify(User_token, process.env.USER_SECRET, {}, async (err, info) => {
      if (err) return res.status(500).send({ message: 'wrong credentials' });

      const { content, image, space } = req.body;
      postModel
        .create({
          content,
          image,
          space,
          authorId: info.id,
        })
        .then((user) => {
          res.send({ sucess: true, data: user, message: 'Post Created!' });
        })
        .catch((err) => {
          console.log(err);
          res.send({ error: true, message: err.message });
        });
    });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
};

exports.getAllPosts = (req, res) => {
  postModel
    .find()
    .populate('authorId', ['name', 'image'])
    .sort({ createdAt: -1 })
    .limit(30)
    .lean()
    .then(async (post) => {
      res.send({ success: true, data: post });
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};

exports.getPost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    const comments = await commentModel
      .find({ postId: req.params.id })
      .populate('authorId', ['image', 'name'])
      .sort({ createdAt: -1 })
      .lean();

    const likes = await reactionModel
      .find({ postId: req.params.id, like: true })
      .count();

    const dislikes = await reactionModel
      .find({ postId: req.params.id, dislike: true })
      .count();

    const payload = {
      postId: post._id,
      author: post.authorId,
      content: post.content,
      image: post.image,
      space: post.space,
      comments: [...comments],
      likes: likes,
      dislikes: dislikes,
      createdAt: post.createdAt,
    };
    res.send({ success: true, data: payload });
  } catch (err) {
    res.send({ error: true, message: err.messasge });
  }
};

exports.updatePost = (req, res) => {
  if (req.files.length > 0) {
    req.body.image = req.files[0].filename;
  }
  postModel
    .findByIdAndUpdate(req.body.id, req.body)
    .then(() => {
      postModel
        .findById(req.body.id)
        .lean()
        .then((user) => {
          res.send({ success: true, message: 'Post Updated', data: user });
        })
        .catch((err) => {
          res.send({ error: true, message: err.message });
        });
    })
    .catch((err) => {
      res.send({ error: true, message: err.message });
    });
};

exports.deletePost = async (req, res) => {
  try {
    await postModel.deleteMany({ _id: req.params.id });

    await reactionModel.deleteMany({
      postId: req.params.id,
    });

    await commentModel.deleteMany({
      postId: req.params.id,
    });
    res.send({ success: true, message: 'User Deleted' });
  } catch (err) {
    res.send({ error: true, message: err.messasge });
  }
};
