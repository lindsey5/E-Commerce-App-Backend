import Cart from "../models/cart.js";
import errorHandler from "../utils/errorHandler.js";

export const add_to_cart = async (req, res) => {
    try{
        const item = await Cart.findOne({ user: req.user_id, item: req.body.item_id })

        if(item){
            item.quantity += req.body.quantity
            await item.save();
            return res.status(200).json({ success: true, item });
        }

        const newCartItem = new Cart({
            user: req.user_id,
            item: req.body.item_id,
            quantity: req.body.quantity
        });

        await newCartItem.save();
        return res.status(200).json({ success: true, item: newCartItem});
        
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}

export const get_cart = async (req, res) => {
    try{
        const cart = await Cart.find({ user: req.user_id}).populate({
            path: 'item',
            populate: {
                path: 'product',  
            }
        });

        const completedCart = cart.map(c => ({
            id: c._id,
            item_id: c.item._id,
            sku: c.item.sku,
            product_id: c.item.product._id,
            name: c.item.product.name,
            quantity: c.quantity,
            price: c.item.price,
            image: c.item.product.image,
            color: c.item.color,
            size: c.item.size,
        }))
        return res.status(200).json({ success: true, cart: completedCart });
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}

export const delete_cart_item = async (req, res) => {
    try{
        const item = await Cart.findOne({ user: req.user_id, _id: req.params.id })

        if(!item) return res.status(404).json({success: false, message: "Cart item id not found"});

        await item.deleteOne();
        return res.status(200).json({ success: true, message: "Item successfully deleted" });
        
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}


export const update_cart_item = async (req, res) => {
    try{
        const item = await Cart.findOne({ user: req.user_id, _id: req.params.id })

        if(!item) return res.status(404).json({success: false, message: "Cart item id not found"});

        item.quantity = req.body.quantity;

        await item.save();
        return res.status(200).json({ success: true, item});
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}