const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    productName: { type: String, required: [ true, "Please enter your product name"]},
    productImage: { type: String, required: [true, "Please enter your product image"]},
    productColor: { type: String, required: [true, "Please enter your product image"]},
    quantity: { type: Number, required: [true, "Please enter your product quantity"]},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "customer", required: [true, "Please enter your user id"]},
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "product", required: [true, "Please enter your product id"]},
    orderId: {type: mongoose.Schema.Types.ObjectId, ref: "order"},
    statusCode: {type: Number, require: true},
    size: {type: String, require: true},
    inforproduct: {type: Object,  require: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);