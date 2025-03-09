import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB Connected Successful: ", conn.connection.host);
  } catch (error) {
    console.log("Error conneting to MONGODB:", error);
  }
};

export default connectDB;
