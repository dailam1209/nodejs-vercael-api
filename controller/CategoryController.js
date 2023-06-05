const Category = require("../models/Category");
const ErrHandle = require("../untils/ErrHandle");

exports.addCategory = async (req, res, next) => {
    try {
        const { title } = req.body;
        const isMatched = await Category.findOne({ title });

        if(isMatched) {
            return (
                next( ErrHandle("Title have matched in database. Please enter new category!", 401,res))
        )}

        if( title ) {
            const category = await Category.create({
                title
            })

            res.status(200).json({
                success: true,
                category
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

exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);

        if(id) {
            const category = await Category.findById(id)

            if(category) {
                category.deleteOne();

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

exports.getAllCategory = async (req, res, next) => {
    const categorys = await Category.find();

    res.status(200).json({
        success: true,
        categorys
    })
}

exports.getACategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if(id) {
            const category = await Category.findById(id)

            if(category) {

                res.status(200).json({
                    success: true,
                    category
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

exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newTitle = {
            title: req.body.title
        }

        if(id) {
            await Category.findByIdAndUpdate(id, newTitle, {
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