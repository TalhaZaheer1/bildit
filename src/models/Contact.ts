import mongoose,{ Document, Schema } from "mongoose"
const { Types:{ObjectId} } = mongoose;


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