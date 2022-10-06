const express = require("express");
const auth = require("../middleware/auth");
const Dislike = require("../model/Dislike");
const Like = require("../model/Like");
const router = express.Router();

router.post("/uplike", auth, (req, res) => {
  //라이크 1추가.
  let variable = {};
  if (req.body.postId) {
    variable = {
      userId: req.user._id,
      postId: req.body.postId,
    };
  } else {
    variable = {
      userId: req.user._id,
      commentId: req.body.commentId,
    };
  }
  const like = new Like(variable);

  like.save((err, likeInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});
router.post("/likes", (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = {
      postId: req.body.postId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
    };
  }
  Like.find(variable).exec((err, likes) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true, likes });
  });
});

router.post("/unlike", auth, (req, res) => {
  //라이크 1 감소

  let variable = {};
  if (req.body.postId) {
    variable = {
      userId: req.user._id,
      postId: req.body.postId,
    };
  } else {
    variable = {
      userId: req.user._id,
      commentId: req.body.commentId,
    };
  }

  Like.findOneAndRemove(variable).exec((err, likeInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});

router.post("/updislike", auth, (req, res) => {
  //라이크 1추가.
  let variable = {};
  if (req.body.postId) {
    variable = {
      userId: req.user._id,
      postId: req.body.postId,
    };
  } else {
    variable = {
      userId: req.user._id,
      commentId: req.body.commentId,
    };
  }

  const dislike = new Dislike(variable);

  dislike.save((err, dislikeInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});
router.post("/dislikes", (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = {
      postId: req.body.postId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
    };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true, dislikes });
  });
});

router.post("/undislike", auth, (req, res) => {
  //라이크 1 감소

  let variable = {};
  if (req.body.postId) {
    variable = {
      userId: req.user._id,
      postId: req.body.postId,
    };
  } else {
    variable = {
      userId: req.user._id,
      commentId: req.body.commentId,
    };
  }

  Dislike.findOneAndRemove(variable).exec((err, dislikeInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});

module.exports = router;
