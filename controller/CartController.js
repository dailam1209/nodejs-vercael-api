const Cart = require("../models/Cart");
const WishList = require("../models/WishListModel");
const ErrHandle = require("../untils/ErrHandle");

exports.addCart = async (req, res, next) => {
    const {
        productName,
        productPrice,
        productImage,
        quantity,
        userId,
        productId,
        stock
    } = req.body;

    const newIterm = await Cart.create({
        productName,
        productPrice,
        productImage,
        quantity,
        userId,
        productId,
        stock
    })

    res.status(201).json({
        success: true,
        newIterm
    })
};

// update Cart quantity
exports.updateCart = async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findByIdAndUpdate(req.params.id);

    if(!cart) {
        return next(
            ErrHandle("No cart found with this id", 404, res)
        )
    }

    await cart.update({
        quantity
    })
}

//get cartData
exports.getCartData = async (req, res, next) => {
    const cartData = await Cart.findById({ userId: req.user.id});
    if(!cartData) {
        return next(
            ErrHandle("No find cartData with userId", 404, res)
        )
    }

    res.status(201).json({
        success: true,
        cartData
    })

}

// remove cartData
exports.removeCartData = async (req, res, next) => {
    const cartData = await Cart.findById(req.params.id);

    if(!cartData) {
        return next( ErrHandle("No find cartData with params id", 404, res ));
    }

    res.status(201).json({
        success: true,
        cartData
    })
}


//wishList
exports.addWishList = async (req, res, next) => {
    const {
        productName,
        productPrice,
        productImage,
        quantity,
        userId,
        productId,
        stock
    } = req.body;

    const newIterm = await WishList.create({
        productName,
        productPrice,
        productImage,
        quantity,
        userId,
        productId,
        stock
    })

    res.status(201).json({
        success: true,
        newIterm
    })
};

// update WishList quantity
exports.updateWishList = async (req, res, next) => {
    const { quantity } = req.body;
    const Wish = await WishList.findByIdAndUpdate(req.params.id);

    if(!Wish) {
        return next(
            ErrHandle("No cart found with this id", 404, res)
        )
    }

    await Wish.update({
        quantity
    })
}

//get WishData
exports.getWishListData = async (req, res, next) => {
    const WishData = await WishList.findById({ userId: req.user.id});
    if(!WishData) {
        return next(
            ErrHandle("No find WishData with userId", 404, res)
        )
    }

    res.status(201).json({
        success: true,
        WishData
    })

}

// remove WishData
exports.removeWishData = async (req, res, next) => {
    const WishData = await WishList.findById(req.params.id);

    if(!WishData) {
        return next( ErrHandle("No find WishData with params id", 404, res ));
    }

    res.status(201).json({
        success: true,
        WishData
    })
}