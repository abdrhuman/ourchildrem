import joi from "joi";
import { Types } from "mongoose";

export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? value
    : helper.message("invalid objectid!");
};
export const foundPersonSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "يجب تقديم الاسم.",
    "string.empty": "يجب ألا يكون الاسم فارغًا."
  }),
  gender: joi.string().required().messages({
    "any.required": "يجب تقديم الجنس.",
    "string.empty": "يجب ألا يكون الجنس فارغًا."
  }),
  location: joi.string().required().messages({
    "any.required": "يجب تقديم الموقع.",
    "string.empty": "يجب ألا يكون الموقع فارغًا."
  }),
  governorate: joi.string().required().messages({
    "any.required": "يجب تقديم المحافظة.",
    "string.empty": "يجب ألا تكون المحافظة فارغة."
  }),
  phone: joi.string().required().messages({
    "any.required": "يجب تقديم رقم الهاتف.",
    "string.empty": "يجب ألا يكون رقم الهاتف فارغًا."
  }),
  // التحقق من صحة الهوية الكائن
  _id: joi.string().custom(isValidObjectId, "Object ID Validation").messages({
    "string.custom": "هوية الكائن غير صالحة."
  })
}).required();

