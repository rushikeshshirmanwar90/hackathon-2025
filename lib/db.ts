import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState == 1) {
    console.log("Connected to Database Successfully..!");
    return;
  }

  if (connectionState == 2) {
    console.log("Connecting to the Database..!");
    return;
  }

  try {
    mongoose.connect(DB_URL!, {
      dbName: "hackathon",
      bufferCommands: true,
    });
  } catch (error: any) {
    console.log("Error : " + error.message);
  }
};

export default connect;