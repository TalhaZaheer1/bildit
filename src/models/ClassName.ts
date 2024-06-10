import mongoose,{ Document,Schema } from "mongoose";


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