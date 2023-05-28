const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    productName: { type: String, required: [ true, "Please enter your product name"]},
    productPrice: { type: Number, required: [true, "Please enter your product price"]},
    productImage: { type: String, required: [true, "Please enter your product image"]},
    quantity: { type: Number, required: [true, "Please enter your product quantity"]},
    userId: {type: String, required: [true, "Please enter your user id"]},
    productId: {type: String, required: [true, "Please enter your product id"]},
    stock: {type: Number, required: [true, "Please enter your product stock"]}
}
);

module.exports = mongoose.model("Cart", CartSchema);