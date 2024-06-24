import mongoose,{ Document, Schema } from "mongoose"
const { Types:{ObjectId} } = mongoose;


const subscriptionSchema: Schema = new mongoose.Schema({
    agency:{
        type: ObjectId,
        ref:"Agency",
        index:true
    },
    plan:{
        type:String,
        enum:["price_1PSrbsAMIkPxnOu6bI3BJALS","price_1PSrbsAMIkPxnOu6RgTsiPtF"]
    },
    price:String,
    active:{
        type:Boolean,
        required:true,
        default:false
    },
    customerId:{
        type:String,
        required:true
    },
    priceId:{
        type:String,
        required:true
    },
    currentPeriodEndDate:{
        type:Date,
        required:true
    },
    subscriptionId:{
        type:String,
        required:true
    }
},{ timestamps:true });

const subscriptionModel = mongoose.models["Subscription"] || mongoose.model<Document>("Subscription",subscriptionSchema); 

export default subscriptionModel