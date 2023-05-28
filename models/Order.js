const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
        userId: {type: String, required: true },
        product: [
            {
                productId: {String, required: true },
                quatity: { type: String, default: 1}
            }
        ],
        amount: { type: String, required: true},
        address: { type: String, required: true },
        status: { type: String, default: "pending"}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", OrderSchema);