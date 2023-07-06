const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
        userId: {type: String, required: true },
        amount: { type: String, required: true},
        payment: { type: Number, required: true },
        status: { type: Number, default: "pending"}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", OrderSchema);