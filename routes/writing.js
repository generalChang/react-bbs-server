const express = require("express");
const auth = require("../middleware/auth");
const Writing = require("../model/Writing");
const router = express.Router();
const async = require("async");
const uploader = require("../module/uploader");
const Like = require("../model/Like");

router.post("/uploadImages", (req, res) => {
  uploader(req, res, (err) => {
    if (err) return res.send({ success: false, err });
    return res.send({
      success: true,
      url: req.file.path,
      filename: req.file.filename,
    });
  });
});

router.post("/upload/writing", auth, (req, res) => {
  const writing = new Writing(req.body);
  writing.save((err, writingInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});

router.post("/writings", (req, res) => {
  const { id } = req.body;
  const skip = req.body.skip ? parseInt(req.body.skip) : 0;
  const limit = req.body.limit ? parseInt(req.body.limit) : 8;
  const searchWord = req.body.searchWord ? req.body.searchWord : "";
  Writing.find({
    community: id,
    title: { $regex: searchWord },
  })
    .skip(skip)
    .limit(limit)
    .sort({
      createdAt: "desc",
    })
    .populate("writer")
    .exec((err, writings) => {
      if (err) return res.send({ success: false, err });

      Writing.find({
        community: id,
        title: { $regex: searchWord },
      })
        .skip(skip + limit)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec((err, info) => {
          if (err) return res.send({ success: false, err });
          return res.send({
            success: true,
            writings,
            isNext: info.length > 0,
          });
        });
    });
});

router.post("/writing", (req, res) => {
  const { id } = req.body;
  Writing.findOne({
    _id: id,
  })
    .populate("writer")
    .exec((err, writing) => {
      if (err) return res.send({ success: false, err });
      if (!writing)
        return res.send({ success: false, msg: "유효하지 않는 글 입니다." });

      return res.send({ success: true, writing });
    });
});

router.post("/view", (req, res) => {
  const { id } = req.body;
  Writing.findOne({
    _id: id,
  }).exec((err, writing) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true, views: writing.views });
  });
});

router.post("/upview", (req, res) => {
  const { id } = req.body;
  Writing.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $inc: {
        views: 1,
      },
    }
  ).exec((err, writingInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});
module.exports = router;
