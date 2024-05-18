import joi from "joi";

/// register
export const registerSchema = joi.object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  }).required()
  //activation Account 
  export const activateSchema = joi.object({
    activationCode : joi.string().required()

  }).required()
  export const loginSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required(),
    

  })
  .required();
  export const forgetCodeSchema = joi.object({
    email: joi.string().email().required(),
    
}).required();


export const resetPasswordSchema = joi.object({
  email: joi.string().email().required(),
  forgetCode: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required()
}).required();
