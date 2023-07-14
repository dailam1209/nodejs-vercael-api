const mongoose= require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true , trim: true},
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    img: [
        {
            public_id: String,
            url: String,
        }
    ],
    color:[
        {
            public_id: String,
            url: String,
        }]
    ,
    size: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true},
    discount: { type: Number, required: true},
    code: { type: String, required: true},
    describe: { type: String, required: true},
    brand: { type: String, required: true},
    category: {type: String, required: true},
    createAt:{
        type: Date,
        default: Date.now()
    },
}
);

module.exports = mongoose.model("Product", ProductSchema);