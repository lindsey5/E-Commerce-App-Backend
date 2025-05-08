import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createToken = (id) => {
    const token = jwt.sign({id }, process.env.JWT_SECRET,{
        expiresIn: 24 * 60 * 60
    })

    return token
}

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}