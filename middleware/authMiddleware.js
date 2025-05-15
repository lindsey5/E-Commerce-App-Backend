import User from "../models/user.js";
import jwt from 'jsonwebtoken'

export const userRequireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1].replace(/"/g, '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user_id = decoded.id; 
        
        const user = await User.findById(req.user_id)
        if(!user) return res.status(401).json({success: false, message: 'User id doesn\'t exist.'})

        next();
    } catch (error) {
        console.log(error.message);
        res.status(403).json({ success: false, message: 'Invalid Token' });
    }
};