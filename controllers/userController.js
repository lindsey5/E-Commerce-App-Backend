import User from "../models/user.js";

export const get_user = async (req, res) => {
    try{
        const user = await User.findById(req.user_id)

        if(!user) return res.status(404).json({ success: false, message: "User not found" })

        res.status(200).json({success: true, user });
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}

export const update_user = async (req, res) => {
    try{
        const result = await User.updateOne(
        { _id: req.user_id }, 
        { $set: req.body }          
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({success: true, message: 'User updated successfully' });
        
    }catch(err){
        console.log(err)
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}