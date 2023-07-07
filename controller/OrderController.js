const Order = require("../models/Order");
const Cart = require("../models/Cart");


exports.createOrder = async (req, res, next) => {

    try {
        const { userId  } = req.body;
        const { payment, amount } = req.body;
    
        const newOrder = {
            userId: userId,
            status: "pending",
            payment: payment,
            amount: amount
        }
    
        await Order.create(newOrder);
        const id = await Order.findOne({  userId: userId,
            status: "pending",
            payment: payment,
            amount: amount 
        })
    
        const listItermCart = await Cart.find({ userId: userId, statusCode: "1"})
        await listItermCart.filter((iterm, index) => {
            iterm.orderId = id._id;
            iterm.statusCode = 2;
            iterm.save();
        })
        res.status(200).json({
            success: true,
            message: "Create newOrder success"
        })
    } catch (err) {
        throw Error(err)
    }
    
    
}

exports.getAllOrder = async (req, res, next) => {
    const  { userId }  = req.body;
    const listItermOrder = [];
    const order = await Order.find({ userId: userId});
    const cart = await Cart.find();

    //page
    let resultPerPage = 1; 
    let page = req.query.page || 1; 
    let skip = resultPerPage * (page - 1);
    let lengthSkip = skip + resultPerPage;

    if(!order) {
        res.status(404).json({
            success: false,
            message: `Not found order by ${userId}`
        })
    }
    else {
        console.log(order);
       await  order.filter((itermOrder, index) => {
        console.log(itermOrder._id);
         let listCartFlowIndex =  cart.filter(cartIterm =>cartIterm.orderId.toString() == itermOrder._id.toString() && cartIterm.statusCode === 2);
         console.log(listCartFlowIndex);
         listItermOrder.push(listCartFlowIndex[0])
        })
        // if(listItermOrder[0].length > lengthSkip) {
        //     listItermOrder[0].slice(skip, lengthSkip)
        // } else {
        //     listItermOrder[0].slice(skip, listItermOrder[0].length)
        // }
        res.status(200).json({
            success: true,
            listItermOrder
        })
    }
}

