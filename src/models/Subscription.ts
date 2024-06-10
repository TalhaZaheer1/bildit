import mongoose,{ Document, Schema } from "mongoose"
const { Types:{ObjectId} } = mongoose;

enum Plan {
    price_1OYxkqFj9oKEERu1NbKUxXxN = "price_1OYxkqFj9oKEERu1NbKUxXxN" ,
    price_1OYxkqFj9oKEERu1KfJGWxgN = "price_1OYxkqFj9oKEERu1KfJGWxgN"
}

const subscriptionSchema: Schema = new mongoose.Schema({
    agency:{
        type: ObjectId,
        ref:"Agency",
        index:true
    },
    plan:{
        type:String,
        enum:["price_1OYxkqFj9oKEERu1NbKUxXxN","price_1OYxkqFj9oKEERu1KfJGWxgN"]
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
    subscritiptionId:{
        type:String,
        required:true
    }
},{ timestamps:true });

const subscriptionModel = mongoose.models["Subscription"] || mongoose.model<Document>("Subscription",subscriptionSchema); 

export default subscriptionModel