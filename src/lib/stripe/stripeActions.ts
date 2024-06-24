"use server"

import agencyModel from "@/models/Agency"
import subscriptionModel from "@/models/Subscription";
import Stripe from "stripe";
import {stripe} from "./index"
import { Types } from "mongoose";

const subscriptionCreated= async (
    subscription:Stripe.Subscription,
    customerId:string
) => {
    try{
        const agency = await agencyModel.findOne({customerId});
        console.log(subscription,"WeBHOOOK SUBSCRIPTION IN DATABASE API")
        if(!agency) 
            throw new Error("Agency not found in subscriptionCreated API")
        const subscriptionData = {
            agency:agency._id,
            active:subscription.status === "active",
            plan:subscription.plan.id,
            subscriptionId:subscription.id,
            priceId:subscription.plan.id,
            currentPeriodEndDate:new Date(subscription.current_period_end*1000),
            customerId
        }
        const isUpserted = await subscriptionModel.findByIdAndUpdate(agency.subscription || new Types.ObjectId(),
            subscriptionData,
            {
                includeResultsMetadata:true,
                upsert:true,
                new:true,
            }
        )
        console.log(isUpserted,"UPSERT DATA")
        console.log(agency.subscription)
        if(!agency.subscription){
            console.log("agency SUB UPDATED@@@@@@@@@@@@")
            await agencyModel.updateOne({
                _id:agency._id
            },{
                subscription:isUpserted._id
            })
        }
        return isUpserted
    }catch(err){
        console.log(err)
    }
}


const getAllProducts = async (connectedAccountId:string) => {
    try{
        const allProductsData = await stripe.products.list({
            limit:50
        }
        ,{
            stripeAccount:connectedAccountId
        }
    )
        return allProductsData.data
    }catch(err){
        console.log(err)
    }
}

export {
    getAllProducts,
    subscriptionCreated,
}