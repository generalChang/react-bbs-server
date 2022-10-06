const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  responseTo: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Writing",
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
