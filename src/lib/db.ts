import {connect} from "mongoose";

const connection: {isConnected?:number} = {};

export default async function dbConnect() {
    if(connection.isConnected){
        return
    }
    const db = await connect(process.env.DATABASE_URL!);
    connection.isConnected = db.connections[0].readyState;
    console.log("DATABASE CONNECTED")
}