import mongoose,{ Document,Schema } from "mongoose";
import { SubAccountInterface } from "./SubAccount";
import { FunnelPageInterface } from "./FunnelPage";
import { ClassNameInterface } from "./ClassName";

export interface FunnelInterface extends Document {
    name: string;
    subAccount: string | mongoose.Schema.Types.ObjectId | SubAccountInterface;
    description?: string;
    subDomainName?: string;
    published: boolean;
    favicon?: string;
    funnelPages: mongoose.Schema.Types.ObjectId[] | FunnelPageInterface[] | string; 
    liveProducts: string;
    classNames: mongoose.Schema.Types.ObjectId[] | ClassNameInterface[] | string;
    updatedAt:Date;
    createdAt:Date;
}

const funnelSchema: Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubAccount",
        required:true,
        index:true
    },
    description:{
        type:String,
    },
    subDomainName:{
        type:String,
    },
    published:{
        type:Boolean,
        default:false,
        required:true
    },
    favicon:String,
    funnelPages:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"FunnelPage",
        required:true
    },
    liveProducts:{
        type:String,
        default:"[]"
    },
    classNames:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"ClassName",
        required:true
    }

},{ timestamps:true })

const funnelModel = mongoose.models["Funnel"] ||  mongoose.model<Document>("Funnel",funnelSchema)

export default funnelModel