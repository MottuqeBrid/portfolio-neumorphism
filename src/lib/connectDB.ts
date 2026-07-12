import mongoose from "mongoose";

const DB_URL = () =>
  process.env.DB_URL || ("mongodb://localhost:27017/portfolio-v4" as string);

export async function connectDB() {
  const dbUrl = DB_URL();
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }
    await mongoose.connect(dbUrl);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
