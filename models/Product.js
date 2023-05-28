const mongoose= require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String},
    img: { type: String, required: true },
    listimg: { type: Array, required: true },
    color: { 
        title: {
            type: String,
            required: true
        },
        imgColor: {
            type: String,
            required: true
        }
     },
    size: { type: Array, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true},
    code: { type: String},
    createAt:{
        type: Date,
        default: Date.now()
    },
}
);

module.exports = mongoose.model("Product", ProductSchema);