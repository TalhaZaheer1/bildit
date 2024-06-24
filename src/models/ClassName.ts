import mongoose,{ Document,Schema } from "mongoose";
import { FunnelInterface } from "./Funnel";


export interface ClassNameInterface extends Document {
    name: string;
    funnel?: mongoose.Schema.Types.ObjectId | FunnelInterface | string;
    color: string;
    customData?: string;
    createdAt?: Date;
    updatedAt?: Date;
}




const classNameSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    funnel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Funnel"
    },
    color:{
        type:String,
        required:true
    },
    customData:String
},{ timestamps:true });

const classNameModel = mongoose.models["ClassName"] || mongoose.model<Document>("ClassName",classNameSchema);

export default classNameModel