const express = require("express");
const auth = require("../middleware/auth");
const Comment = require("../model/Comment");
const router = express.Router();

router.post("/save/comment", auth, (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, commentinfo) => {
    if (err) return res.send({ success: false, err });

    Comment.findOne({
      _id: commentinfo._id,
    })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.send({ success: false, err });
        return res.send({ success: true, comment: result });
      });
  });
});

router.post("/comments", (req, res) => {
  const { postId } = req.body;
  Comment.find({
    postId,
  })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.send({ success: false, err });
      return res.send({ success: true, comments });
    });
});
module.exports = router;
