import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: {
            address: { 
                type: String,
                required: true
            },
            zip: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        },
    }

}, { timestamps: true })

const User = mongoose.model('User', UserSchema);
export default User