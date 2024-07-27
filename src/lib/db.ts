import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  console.log(process.env.DB_URI + "Connection string")
  if (connection.isConnected) {
    console.log("Already connected to db");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.DB_URI || "");
    connection.isConnected = db.connections[0].readyState;

    console.log("db connected");  
  } catch (error) {
    console.log("db connection failed", error);
    process.exit(1);
  }
}

export default dbConnection;