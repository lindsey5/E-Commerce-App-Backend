import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },

}, { timestamps: true })

const Cart = mongoose.model('Cart', CartSchema);
export default Cart