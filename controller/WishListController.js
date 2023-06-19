const WishList = require("../models/WishListModel");
const Product = require("../models/Product");
const { lastResult } = require("../untils/reduceProduct");

//wishList
exports.changeWishList = async (req, res, next) => {

    try {
        const { userId, code } = req.body;

        const iterm = await WishList.findOne({ userId : userId, code: code});
        if(iterm) {
            await WishList.deleteOne({userId: userId, code: code})
            res.status(200).json({
                success: true,
                message: "Deleted WishList"
            })
        } 
        else {
            await WishList.create({
               userId,
               code
           })
           res.status(200).json({
               success: true,
               message: "added WishList"
           })
        }
    } catch (err) {
        throw Error(err);
    }
   

};

exports.getAllWishList = async (req, res, next) => {

    try {
        const userId  = req.params.id;

        const iterms = await WishList.find({ userId : userId});
        let listWish = [] ;
        if(!iterms) {
            res.status(200).json({
                success: flase,
                message: `Dont have WishList of user for ${userId}`
            })
        }
        else {
            const allProduct = await Product.find();
            iterms.filter((code, i) => {
                allProduct.filter((wishlist, index) => {
                    if(code.code === wishlist.code) {
                        listWish.push(allProduct[index]);
                    }
                })
            })
           const flowCode = await  lastResult('code', listWish )
           res.status(200).json({
               success: true,
               flowCode
           })
        }
    } catch (err) {
        throw Error(err);
    }
   

};


