const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saveSchema = new Schema({
  Name: { type: String, required: [true, "Name cannot be empty"] },
  Release: { type: String, required: [true, "Release cannot be empty"] },
  SavedBy: { type: Schema.Types.ObjectId, ref: "User" },
  Status: { type: String },
});



const saveItem = mongoose.model("watch", saveSchema);

module.exports = saveItem;
