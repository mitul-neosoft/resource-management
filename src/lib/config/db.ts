import mongoose from "mongoose";

const uri: string =
  process.env.CONNECTION_URL ??
  "mongodb+srv://akshaylagad_db_user:gKDeVNACELOhpZaj@cluster0.urdples.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose;
    }

    await mongoose.connect(uri);

    return mongoose;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from DB");
});

mongoose.connection.on("error", (error: Error) => {
  console.error("MongoDB connection error:", error);
});

export default connectDB;