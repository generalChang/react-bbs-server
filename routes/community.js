const express = require("express");
const router = express.Router();
const uploader = require("../module/uploader");
const auth = require("../middleware/auth");
const Community = require("../model/Community");

router.post("/image", (req, res) => {
  uploader(req, res, (err) => {
    if (err) return res.send({ success: false, err });
    return res.send({
      success: true,
      url: req.file.path,
      filename: req.file.filename,
    });
  });
});

router.post("/make/community", auth, (req, res) => {
  req.body.manager = req.user._id;
  const community = new Community(req.body);

  community.save((err, comInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});

router.post("/communitys", (req, res) => {
  const skip = req.body.skip ? parseInt(req.body.skip) : 0;
  const limit = req.body.limit ? parseInt(req.body.limit) : 8;
  const searchWord = req.body.searchWord ? req.body.searchWord : "";
  const userId = req.body.userId;

  const variable = { title: { $regex: searchWord } };
  if (userId) {
    variable["manager"] = userId;
  }
  Community.find(variable)
    .skip(skip)
    .limit(limit)
    .populate("manager")
    .exec((err, communitys) => {
      if (err) return res.send({ success: false, err });

      Community.find(variable)
        .skip(skip + limit)
        .limit(limit)
        .exec((err, info) => {
          if (err) return res.send({ success: false, err });
          return res.send({
            success: true,
            communitys,
            isNext: info.length > 0,
          });
        });
    });
});

router.post("/community", (req, res) => {
  const { id } = req.body;

  Community.findOne({
    _id: id,
  })
    .populate("manager")
    .exec((err, communityInfo) => {
      if (err) return res.send({ success: false, err });
      return res.send({ success: true, community: communityInfo });
    });
});

router.post("/community/update", auth, (req, res) => {
  const data = {}; //변경해줄 데이터
  for (let key in req.body) {
    if (key == "image") {
      if (req.body.image !== "") {
        data[key] = req.body[key];
      }
    } else {
      data[key] = req.body[key];
    }
  }

  Community.findOneAndUpdate(
    {
      _id: req.body.id,
    },
    data
  ).exec((err, communityInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});
module.exports = router;
