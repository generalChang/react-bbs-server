const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommunitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, //관리인. 해당 커뮤니티를 개설한 사람.
  image: {
    type: String,
    required: true,
  }, //커뮤니티의 프로필 이미지.
});

const Community = mongoose.model("Community", CommunitySchema);
module.exports = Community;
