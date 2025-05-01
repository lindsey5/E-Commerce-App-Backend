import Product from '../models/product.js'
import Item from '../models/item.js';
import errorHandler from '../utils/errorHandler.js';

export const create_product = async (req, res) => {
    try{
        const product = await Product.findOne({ name: req.body.name});
        if(product) return res.status(400).json({ success: false, message: "Product already exists."});

        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(200).json({ success: true, newProduct });
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({errors});
    }
}

export const get_product = async (req, res) => {
    const { id } = req.params;
    try{
        const product = await Product.findById(id);
        if(!product) return res.status(404).json({ success: false, message: "Product not found."})
        
        const items = await Item.find({ product: id});

        return res.status(200).json({ success: true, product: { ...product.toObject(), items}});
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({errors});
    }
}

export const get_products = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const searchTerm = req.query.searchTerm || '';

        const skip = (page - 1) * limit;

        const products = await Product.find({
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { tags: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }
            ]
        })
        .skip(skip)
        .limit(limit);
        const total = await Product.countDocuments();

        const productsWithStock = await Promise.all(products.map(async (product) => {
            const items = await Item.find({ product: product.id })
            const stock = items.reduce((total, item) => total + item.stock, 0);
            return { ...product.toObject(), stock, items }
        }));

        res.status(200).json({ 
            success: true, 
            products: productsWithStock,
            totalPages: Math.ceil(total / limit),
            total,
            page,
        });
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({errors});
    }
}

export const update_product = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findOne({
            _id: { $ne: id }, 
            name: req.body.name,
        });
        if(product) return res.status(400).json({ success: false, message: "Product already exists."});

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id }, 
            req.body, 
            { new: true });

        res.status(200).json({success: true, updatedProduct});
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({errors});
    }
}