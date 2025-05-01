import mongoose, { Schema } from "mongoose";

const TagSchema = new Schema({
    tagName: {
        type: String,
        unique: true,
        required: true
    },
}, { timestamps: true })

const Tag = mongoose.model('Tag', TagSchema);
export default Tag