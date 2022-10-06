const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const saltRounds = 10;
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  emailCertificated: {
    type: Boolean,
    default: false,
  },
  authCode: {
    type: String,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  passwordReset: {
    type: Boolean,
    default: false,
  },

  username: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    default: 0,
  },
  age: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  }, //유저의 프로필 이미지.
  imageUpdated: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        return next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  let user = this;
  bcrypt.compare(plainPassword, user.password, function (err, result) {
    if (err) return cb(err);
    return cb(null, result);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;
  jwt.sign(user._id.toHexString(), "secret", function (err, token) {
    if (err) return cb(err);
    user.token = token;
    user.save((err, userInfo) => {
      if (err) return cb(err);
      return cb(null, userInfo);
    });
  });
};

userSchema.statics.findUserByToken = function (token, cb) {
  jwt.verify(token, "secret", function (err, decoded) {
    User.findOne({
      token: token,
      _id: decoded,
    }).exec((err, userInfo) => {
      if (err) return cb(err);
      return cb(null, userInfo);
    });
  });
};

userSchema.statics.generateEncryptedPassword = function (myPlainPassword, cb) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlainPassword, salt, function (err, hash) {
      // Store hash in your password DB.
      if (err) return cb(err);
      return cb(null, hash); //암호화된 패스워드를 반환.
    });
  });
};
const User = mongoose.model("User", userSchema);

module.exports = User;
