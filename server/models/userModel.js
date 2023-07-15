const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please, Enter your name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [4, "Name must be 4 character long"],
  },
  username: {
    type: String,
    required: [true, "Please, Enter your username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please, Enter your email"],
    unique: true,
    validator: [validator.isEmail, "Please provide valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    select: false, //hide password in .find() method.
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "admin", "super_admin"],
    default: "student",
  },
  course: {
    type: String,
  },
  semester: {
    type: String,
  },
  roll_no: {
    type: String,
  },
  phone_no: { type: Number },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//runs before the "save" operation,  a common way to securely store user passwords in a database.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//generating password reset token

userSchema.methods.getResetPasswordToken = function () {

  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
