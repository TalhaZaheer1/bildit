import mongoose,{ Document,Schema } from "mongoose";


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

const funnelModel = mongoose.models["FunnelPage"] ||  mongoose.model<Document>("FunnelPage",funnelPageSchema);

export default funnelModel