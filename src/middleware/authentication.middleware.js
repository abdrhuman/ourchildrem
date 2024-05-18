/*import { Token } from "../../DB/models/token.model.js";


import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = asyncHandler(async(req,res,next)=>{
    let token = req.headers["token"];
    if (!token || !token.startsWith('Bearer')) return next(new Error('Valid token is required', 400));

    token =token.split(process.env.BEARERKEY)[1];
    const decoded = jwt.verify(token,process.env.TOKEN_KEY);
    if(!decoded)return next(new Error("Invalid token!"));
    const tokenDB = await Token.findOne({token,isValid:true});
    if (!tokenDB)return next(new Error("Token expired!"));
    const user = await User.findOne({email:decoded.email});
    if(!user)return next(new Error('User not Found!'));
    req.user = user;
    return next()
})*/

import { Error } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";


export const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    let token = req.headers["token"];
    if (!token || !token.startsWith(process.env.BEARERKEY))
      throw new Error("Valid token is required!");
    token = token.split(process.env.BEARERKEY)[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (!decoded) throw new Error("Invalid token!");
    const tokenDB = await Token.findOne({ token, isValid: true });
    if (!tokenDB) throw new Error("Token expired!");

    const user = await User.findOne({ email: decoded.email });
    if (!user) throw new Error("User not found!");
    req.user = user;
    return next();
  } catch (err) {
    next(err);
 }
});