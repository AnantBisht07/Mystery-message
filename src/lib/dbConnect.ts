import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 

// db ke object mai kya data jara hai uska type
// this means this is optional or ayegi to srf number format mai
// Defining a type for the `connection` object
// `isConnected` will store the connection state (optional and should be a number)
type ConnectionObject = {
    isConnected?: number
}

// Creating a global connection object to track DB connection status
const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    // phly se connected
    if(connection.isConnected) {
        console.log("Already Connected to DB");
        return;
    }

    // if not, attempt to establish a new connection 
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log('DB Connected Successfully!')
    } catch (error) {
        console.log('DB Connection Failed', error);
        process.exit(1);
    }
}


export default dbConnect;