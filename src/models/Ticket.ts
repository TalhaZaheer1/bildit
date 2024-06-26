import mongoose,{ Document,Schema } from "mongoose";
import { LaneInterface } from "./Lane";
import { UserInterface } from "./User";
import { TagInterface } from "./Tag";
import { ContactInterface } from "./Contact";

export interface TicketInterface extends Document  {
    name:string;
    lane:mongoose.Schema.Types.ObjectId | LaneInterface | string
    order:number;
    description?:string;
    value:number;
    customer:mongoose.Schema.Types.ObjectId | string | ContactInterface;
    assignedUser:mongoose.Schema.Types.ObjectId | string | UserInterface;
    tags?:mongoose.Schema.Types.ObjectId[] | TagInterface[]
    createdAt:Date;
    updatedAt:Date;
}

const ticketSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    lane:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lane",
        index:true,
        required:true
    },
    order:{
        type:Number,
        default:0,
        required:true
    },
    description:String,
    value:{
        type:Number,
        required:true
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contact",
        index:true
    },
    assignedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
    tags:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Tag"
    }
},{timestamps:true})

const ticketModel = mongoose.models["Ticket"] || mongoose.model<TicketInterface>("Ticket",ticketSchema)

export default ticketModel