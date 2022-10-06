const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const writingSchema = mongoose.Schema(
  {
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    title: {
      type: String,
      maxlength: 50,
      required: true,
    },
    content: {
      type: String,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Writing = mongoose.model("Writing", writingSchema);
module.exports = Writing;
