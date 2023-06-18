const mongoose = require('mongoose');

const WishListSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: [true, "Please enter your user id"]},
    code: {type: String, required: [true, "Please enter product code"]},
}
);

module.exports = mongoose.model("WishList", WishListSchema);