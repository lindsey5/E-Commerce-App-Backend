import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
}, { timestamps: true })

const Item = mongoose.model('Item', ItemSchema);
export default Item