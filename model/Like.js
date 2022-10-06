const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const likeSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
