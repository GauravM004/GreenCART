import mongoose from "mongoose";

const connectDB = async () => {
  try {
await mongoose.connect(
  `${process.env.MONGODB_URI}/greencart?retryWrites=true&w=majority`
);
    console.log("Database Connected");
  } catch (error) {
    console.error("DB error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
