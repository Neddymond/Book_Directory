const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/** User Schema */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Please use a more secure password");
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});


/** Static methods can be called directly on a model */
userSchema.statics.FindByCredentials = async (email, password) => {
  const user = await User.findOne({email});
  if (!user) {
    throw new Error("unable to login");
  }

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new Error("Unable to login");
  }

  return user;
};

/** Secure user password */
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;