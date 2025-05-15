import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
    order_id:{
        type: String,
        unique: true,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true
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
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    paymentIntentId: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Order = mongoose.model('Order', OrderSchema);
export default Order