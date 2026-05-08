import { connectDB } from "./db.js";

let isConnected = false;

export const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("Mongo Connected");
  }
};
