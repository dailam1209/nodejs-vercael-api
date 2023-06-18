const WishList = require("../models/WishListModel");
const ErrHandle = require("../untils/ErrHandle");

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