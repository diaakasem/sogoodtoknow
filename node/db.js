const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: { type: String, index: true},
  title: String,
  text: String,
  description: String,
  keywords: String,
  images: [],
  status: String,
  youtube: String,
  wikipedia: String,
  audio: {
    voice: String,
    file: String
  }
});
module.exports.projectSchema = projectSchema;
module.exports.config = function(app) {
  mongoose.model("Project", projectSchema);
  return mongoose.connect(app.get("db connect string"));
};

