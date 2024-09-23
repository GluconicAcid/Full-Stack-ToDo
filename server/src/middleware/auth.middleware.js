import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({message: "Unauthorized request: No Token Provided"});
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({message: "Invalid Access Token: User Not Found"});
        }

        req.user = user;
        next();
    } catch (error) {
        throw res.status(401).json({message: error?.message || "Invalid access token"});
    }
}