const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dislikeSchema = mongoose.Schema({
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

const Dislike = mongoose.model("Dislike", dislikeSchema);

module.exports = Dislike;
