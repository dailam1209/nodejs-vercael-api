const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false,
        default: false
    },
    username: {
        type: String,
        required: true,
        minlength: [3, "Please enter a username atleast 3 characters"],
        maxlength: [15, "Username can not big than 15 characters"],
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true
    },
    birthDay: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, " Please enter your password"],
        select: true
    },
    article_image: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "user",
        required: false,
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: {
        type: String,
        required: false,
        default: ""
    },
    resetPasswordTime: {
        type: Date,
        required: false,
        default: ""
    }

    }
);


// compare password
UserSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}


// forgot password
UserSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256")
                                    .update(resetToken)
                                    .digest("hex");

    this.resetPasswordTime = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

/// jwt token
UserSchema.methods.getJwtToken =  function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
}

module.exports = mongoose.model("User", UserSchema);