import joi from "joi";
import { Types } from "mongoose";

// تحقق من أن القيمة تمثل ObjectId صالح
export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? value
    : helper.message("Invalid ObjectId!");
};

// مخطط التحقق من البيانات لـ lostPerson
export const lostPersonSchema = joi.object({
  name: joi.string().required(),
  gender: joi.string().required(),
  location: joi.string().required(),
  governorate: joi.string().required(),
  phone: joi.string().required()
}).required();
