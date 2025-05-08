import User from "../models/user.js";
import { sendVerificationCode } from "../services/emailService.js";
import { hashPassword, createToken } from '../utils/authUtils.js';
import errorHandler from "../utils/errorHandler.js";

export const signup = async (req, res) => {
    try{
        const isExist = await User.findOne({ email: req.body.email });
        if(isExist) return res.status(400).json({ success: false, message: "Email is already used."});
        
        const hashedPassword = await hashPassword(req.body.password);

        const newUser = new User({...req.body, password: hashedPassword});
        await newUser.save();

        const token = createToken(newUser._id);

        res.status(200).json({success: true, newUser, token});
        
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}

export const sendSignupVerification = async (req, res) => {
    try{
        const isExist = await User.findOne({ email: req.body.email })

        if(isExist) throw new Error("Email is already used.");

        const verificationCode =  await sendVerificationCode(req.body.email);

        return res.status(200).json({ success: true, verificationCode });

    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}