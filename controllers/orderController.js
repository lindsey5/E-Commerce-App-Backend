import Order from "../models/order.js";
import errorHandler from "../utils/errorHandler.js";

const generateOrderId = async () => {
  const prefix = 'ORD-';
  const orderId = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Check if it already exists in the database
  const existingOrder = await Order.findOne({ orderId });

  // If it exists, retry
  if (existingOrder) {
    return generateOrderId();
  }

  return orderId;
};

export const create_order = async (req, res) => {
    try{
        const order_id = await generateOrderId();
        const order = new Order({ order_id, user: req.user_id, ...req.body});

        await order.save();
        res.status(200).json({success: true, order});
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}

export const get_orders = async (req, res) => {
    try{
        const orders = await Order
        .find({ user: req.user_id})
        .sort({ created_At: -1})
        .populate({
            path: 'item',
            populate: {
                path: 'product',  
            }
        });

        res.status(200).json({success: true, orders});
        
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}
