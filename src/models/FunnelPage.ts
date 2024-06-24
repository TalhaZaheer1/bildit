import mongoose,{ Document,Schema } from "mongoose";
import { FunnelInterface } from "./Funnel";

export interface FunnelPageInterface extends Document {
    name: string;
    order: number;
    funnel: mongoose.Schema.Types.ObjectId | FunnelInterface | string;
    pathName: string;
    previewImage?: string;
    visits: number;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const funnelPageSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    order:{
        type:Number,
        required:true
    },
    funnel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Funnel",
        required:true,
        index:true
    },
    pathName:{
        type:String,
        required:true,
        default:""
    },
    previewImage:String,
    visits:{
        type:Number,
        default:0,
        required:true
    },
    content:{
        type:String,
    }
},{ timestamps:true })

const funnelPageModel = mongoose.models["FunnelPage"] ||  mongoose.model<Document>("FunnelPage",funnelPageSchema);

export default funnelPageModel