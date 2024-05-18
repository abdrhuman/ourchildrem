import mongoose from "mongoose"

const connectDB = async (req,res,next) => {
    return await mongoose.connect(process.env.CONNECTION_URL).then((res) => console.log("DB connection success")).catch((err) => console.log("DB connection Fail", err));
  };
  export default connectDB;