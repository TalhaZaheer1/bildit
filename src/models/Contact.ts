import mongoose,{ Document, Schema } from "mongoose"
import { TicketInterface } from "./Ticket";
const { Types:{ObjectId} } = mongoose;


export interface ContactInterface extends Document {
    name:string;
    email:string;
    subAccount:string | mongoose.Schema.Types.ObjectId;
    tickets:string[] | mongoose.Schema.Types.ObjectId[] | TicketInterface[];
    createdAt:Date;
    updatedAt:Date
}

const contactSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subAccount:{
        type:ObjectId,
        ref:"SubAccount",
        index:true,
        required:true
    },
    tickets:{
        type:[ObjectId],
        ref:"Ticket",
        required:true
    }
},{ timestamps:true });


export default mongoose.models["Contact"] ||  mongoose.model<Document>("Contact",contactSchema)