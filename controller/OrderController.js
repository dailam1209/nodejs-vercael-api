const Order = require("../models/Order");
const Cart = require("../models/Cart");


exports.createOrder = async (req, res, next) => {
    const { userId  } = req.params;
    const { payment, amount } = req.body;

    const newOrder = {
        userId: userId,
        status: "pending",
        payment: payment,
        amount: amount
    }

    await Order.create(newOrder);

    const listItermCart = Cart.find({ userId: userId, status: "pending"})
    await listItermCart.fillter((iterm, index) => {
        Cart.updateOne({ userId: userId, productId: iterm.productId, size: iterm.size}, {
            $set: {
                orderId: newOrder._id
            }
        })
    })
    res.status(200).json({
        success: true,
        message: "Create newOrder success"
    })
    
}

exports.getAllOrder = async (req, res, next) => {
    const { userId } = req.params;
    const order = Order.findOne({ userId: userId});
    if(!order) {
        res.status(404).json({
            success: false,
            message: `Not found order by ${userId}`
        })
    }
    else {
        const listItermOrder = Cart.find({ orderId: order._id, status: "pending"});
        res.status(200).json({
            success: true,
            listItermOrder
        })
    }
}

