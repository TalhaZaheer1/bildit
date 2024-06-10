import mongoose,{ Document,Schema } from "mongoose";
import { PipelineInterface } from "./Pipeline";
import { TicketInterface } from "./Ticket";

export interface LaneInterface extends Document {
    name:string;
    pipeline:mongoose.Schema.Types.ObjectId | PipelineInterface;
    tickets:mongoose.Schema.Types.ObjectId[] | TicketInterface[];
    order:number;
    createdAt:Date;
    updatedAt:Date;
}

const laneSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pipeline:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pipeline",
        required:true
    },
    tickets:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Ticket",
        required:true
    },
    order:{
        type:Number,
        default:0
    }

},{ timestamps:true })

const laneModel = mongoose.models["Lane"] ||  mongoose.model<LaneInterface>("Lane",laneSchema);

export default laneModel