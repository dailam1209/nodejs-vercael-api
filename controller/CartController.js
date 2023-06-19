const Cart = require("../models/Cart");
const Product = require("../models/Product")

const ErrHandle = require("../untils/ErrHandle");

exports.addCart = async (req, res, next) => {

    const {
        productName,
        productImage,
        quantity,
        userId,
        productId,
        statusCode,
        inforproduct,
        size
    } = req.body;

    await Cart.create({
        productName,
        productImage,
        quantity,
        userId,
        productId,
        statusCode,
        inforproduct,
        size
    })

    res.status(201).json({
        success: true,
    })
};

// update Cart quantity
exports.updateCart = async (req, res, next) => {
    try {

        const { userId, quantity, productId, size } = req.body;
        const cart = await Cart.find({ userId: userId, productId: productId, size: size});
        
        if(!cart) {
            return next(
                ErrHandle("No cart found with this id to update", 404, res)
            )
        }
        await Cart.updateOne({ userId: userId, productId: productId, size: size}, 
            {
                $set: {
                    quantity: quantity
                }
            })

            res.status(200).json({
                success: true,
                message: "update"
            })
    } catch (err) {
        res.status(401).json({
            success: false,
            message: err.message
        })
    }
}

//get cartData => ok
exports.getCartData = async (req, res, next) => {
    
    const  userId  = req.params.id;
    const cartData = await Cart.find({userId : userId });
    if(!cartData) {
        return next(
            ErrHandle("No find cartData with userId", 404, res)
        )
    }
    if(cartData) {
        const allProduct = await Product.find();
        await cartData.filter((cart, ind) => {
            let productId = cart.productId;
             allProduct.filter( (product, index) => {
                 if(product._id.toString() === productId.toString()) {
                    console.log("a",allProduct[index])
                    cartData[ind].inforproduct = allProduct[index] ;
                }
            })
        })
    }
    res.status(201).json({
        success: true,
        cartData
    })

}

// remove cartData ==> ok
exports.removeCartData = async (req, res, next) => {
    try {
        const { productId, userId, size } = req.body;
        const cartData = await Cart.find({userId: userId, productId: productId,  size: size});

        if(!cartData) {
            return next( ErrHandle("No find cartData with params id", 404, res ));
        }
        await Cart.deleteOne({userId: userId, productId: productId, size: size})
        res.status(201).json({
            success: true,
            message: "Deleted!"
        })
        
        
    } catch (err) {
        throw Error(err);
    }
} 


