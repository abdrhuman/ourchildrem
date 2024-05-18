import mongoose, { Schema,model } from "mongoose";

// schema
const userSchema = new Schema(
    {
        userName: {
          type: String,
          required: true,
          min: 3,
          max: 20,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
        },
        password: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["online", "offline"],
          default: "offline",
        },
        role: {
          type: String,
          default: "user",
          enum: ["user", "admin"],
        },
    
        activationCode: {
          type: String, 
          default: "", // تغيير قيمة الافتراضي لتكون نصًّا فارغًا بدلاً من قيمة false
      },
      
        forgetCode: String,
        isConfirmed: {
          type: Boolean,
          default: false,
        },
        profileImage: {
          url: {
            type: String,
            default:
              "https://res.cloudinary.com/dyko7mcyi/image/upload/v1710914415/samples/our%20children/user/th_hhvpch.jpg",
          },
          id: {
            type: String,
            default:
              "our%20children/user/th_hhvpch",
          },
        },
        coverImages: [
          {
            url: { type: String, required: true },
            id: { type: String, required: true },
          },
        ],
      },
      {
        timestamps: true,
      }
    );
    
    export const User = mongoose.models.User||model("User", userSchema);
    
