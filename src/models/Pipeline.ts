import mongoose,{Document,Schema} from "mongoose";
import { SubAccountInterface } from "./SubAccount";
import "./Lane";
import { LaneInterface } from "./Lane";

export interface PipelineInterface extends Document {
    name:string;
    lanes:mongoose.Schema.Types.ObjectId[] | LaneInterface[];
    subAccount:mongoose.Schema.Types.ObjectId | SubAccountInterface;
    createdAt:Date;
    updatedAt:Date;
}

const pipelineSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    lanes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Lane"
    },
    subAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubAccount",
        index:true
    }
},{ timestamps:true })

const pipelineModel = mongoose.models["Pipeline"] ||  mongoose.model<PipelineInterface>("Pipeline",pipelineSchema); 

export default pipelineModel