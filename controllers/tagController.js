
import Product from "../models/product.js";
import Tag from "../models/tag.js";
import errorHandler from "../utils/errorHandler.js";

export const create_tag = async (req,res) => {
    try{
        const { tagName } = req.body;
        const tag = await Tag.findOne({ tagName });
        if(tag) return res.status(400).json({ success: false, message: "Tag already exist"});

        const newTag = new Tag(req.body);
        await newTag.save();
        res.status(200).json({ success: true, newTag});
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}

export const get_tags = async (req, res) => {
    try{
        const tags = await Tag.find({});

        const completedTags = await Promise.all(tags.map(async (tag) => {
            const numberOfProducts = await Product.countDocuments({ tags: tag.tagName});
            return { ...tag.toObject(), numberOfProducts }
        }))

        res.status(200).json({success: true, tags: completedTags});
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}