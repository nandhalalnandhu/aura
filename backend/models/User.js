const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields like profilePicture, fullName, etc.

  passwordResetToken: String,
  passwordResetExpires: Date,
});
module.exports = mongoose.model("User", userSchema);
