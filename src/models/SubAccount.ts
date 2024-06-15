import mongoose,{Document,Schema,ObjectId} from "mongoose";
import { Role } from "@/lib/types";
import { MediaInterface } from "./Media";

export interface SubAccountInterface extends Document{

    connectAccountId?: string; // Optional since no default value
    name: string;
    subAccountLogo?: string; // Optional since no default value
    companyEmail: string;
    companyPhone?: string; // Optional
    address?: string; // Optional
    city?: string; // Optional
    zipCode?: string; // Optional
    state?: string; // Optional
    country?: string; // Optional
    goal?: number; // Optional - could be missing or null
    agency: ObjectId | string; // Optional since ref is set
    sidebarOptions: {
        name:string,
        link:string,
        icon:string
      }[]; // Optional since ref is set
    permissions?: ObjectId[]; // Optional since ref is set
    funnels?: ObjectId[]; // Optional since ref is set
    media?: ObjectId[] | MediaInterface[]; // Optional since ref is set
    contacts?: ObjectId[]; // Optional since ref is set
    triggers?: ObjectId[]; // Optional since ref is set
    automations?: ObjectId[]; // Optional since ref is set
    pipelines?: ObjectId[]; // Optional since ref is set
    tags?: ObjectId[]; // Optional since ref is set
    notifications?: ObjectId[]; // Optional since ref is set
    createdAt: Date;
    updatedAt: Date;
  }

const subAccountSchema: Schema = new mongoose.Schema({
    connectAccountId:String, 
    name:{
        type:String,
        required:true
    },
    subAccountLogo:String,
    companyEmail:{
        type:String,
        required:true
    },
    companyPhone:String,
    address:String,
    city:String,
    zipCode:String,
    state:String,
    country:String,
    goal:Number,
    agency:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Agency",
        index:true
    },
    sidebarOptions:[
        {
          name: {
            type: String,
            default: "Menu",
          },
          link: {
            type: String,
            default: "#",
          },
          icon: String, //change to type ICON},
        },
    ],
    permissions:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Permission"
    },
    funnels:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Funnel"
    },
    media:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Media"
    },
    contacts:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Contact"
    },
    triggers:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Trigger"
    },
    automations:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Automation"
    },
    pipelines:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Pipeline"
    },
    tags:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Tag"
    },
    notifications:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Notification"
    }
},{ timestamps:true })


const subAccountModel = mongoose.models["SubAccount"] || mongoose.model<SubAccountInterface>("SubAccount",subAccountSchema); 

export default subAccountModel