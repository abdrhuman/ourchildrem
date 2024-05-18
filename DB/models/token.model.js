
import mongoose, { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User' // اسم الموديل المرتبط
    },
    agent: {
        type: String
    },
    expiredAt: {
        type: Date, // تغيير النوع إلى Date لتخزين التواريخ
    },
    isValid: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Token = mongoose.models.Token || model("Token", tokenSchema);
