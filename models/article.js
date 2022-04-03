const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: Date,
  quote: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  verse: {
    type: String,
    required: true,
  },
  blogBody: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
