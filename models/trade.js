const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
  Name: { type: String, required: [true, "Movie Name cannot be empty"] },
  Release: { type: String, required: [true, "Release cannot be empty"] },
  OfferedBy: { type: Schema.Types.ObjectId, ref: "User" },
  Status: { type: String },
});


const tradeItem = mongoose.model("offer", tradeSchema);

module.exports = tradeItem;


