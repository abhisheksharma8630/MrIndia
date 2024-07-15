import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

// void is different from other programming langauges in Typescript it means it doesn't care about the type
async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to Database");
        return;
    }

    try{
       const db = await mongoose.connect(process.env.MONGODB_URL || "");
       connection.isConnected = db.connections[0].readyState;
       console.log("DB Connected Successfully");
    }catch(error){
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;