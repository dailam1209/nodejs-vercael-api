const Brand = require("../models/Brand");
const ErrHandle = require("../untils/ErrHandle");

exports.addBrand = async (req, res, next) => {
    try {
        const { title } = req.body;
        const isMatched = await Brand.findOne({ title });

        if(isMatched) {
            return (
                next( ErrHandle("Title have matched in database. Please enter new Brand!", 401,res))
        )}

        if( title ) {
            const brand = await Brand.create({
                title
            })

            res.status(200).json({
                success: true,
                brand
            })
        } else {
            return next(
                ErrHandle("Please enter title", 401, res)
            )
        }
    }
    catch (err) {
        throw new Error(err)
    }
}

exports.deleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(id) {
            const brand = await Brand.findById(id)

            if(brand) {
                brand.deleteOne();

                res.status(200).json({
                    success: true,
                    message: "Delete success."
                })
            }
            else {
                return next(
                    ErrHandle("Id not match", 401, res)
                )
            }

        } 
    }
    catch (err) {
        throw new Error(err)
    }
}

exports.getAllBrand = async (req, res, next) => {
    const brands = await Brand.find();

    res.status(200).json({
        success: true,
        brands
    })
}

exports.getABrand = async (req, res, next) => {
    try {
        const { id } = req.params;

        if(id) {
            const brand = await Brand.findById(id)

            if(brand) {

                res.status(200).json({
                    success: true,
                    brand
                })
            }
            else {
                return next(
                    ErrHandle("Id not match", 401, res)
                )
            }

        } 
    }
    catch (err) {
        throw new Error(err)
    }
}

exports.updateBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newTitle = {
            title: req.body.title
        }

        if(id) {
            await Brand.findByIdAndUpdate(id, newTitle, {
                new: true
            })

            res.status(200).json({
                success: true,
                message: "Update succees."
            })
            

        } else {
            return next(
                ErrHandle("No id match with id", 401, res)
            )
        }
    }
    catch (err) {
        throw new Error(err)
    }
}