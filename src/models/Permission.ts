import mongoose, {Document, Schema} from "mongoose";
import { Role } from "@/lib/types";
import { UserInterface } from "./User";
import { SubAccountInterface } from "./SubAccount";

export interface PermissionInterface extends Document {
    email: string;
    subAccount?: mongoose.Schema.Types.ObjectId |SubAccountInterface | string; // Allow optional string for flexibility
    access: boolean;
    user?: UserInterface; // Optional user object based on the User interface (assumed to exist)
  }

const permissionSchema:Schema = new mongoose.Schema({
    email:{
        type:String,
        index:true
    },
    subAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubAccount",
        index:true
    },
    access:Boolean
},{
    toJSON:{
        virtuals:true
    },
    virtuals:{
        user:{
            options:{
                ref:"User",
                localField:"email",
                foreignField:"email",
                justOne:true
            }
        }
    }
})

const permissionModel = mongoose.models["Permission"] ||  mongoose.model<PermissionInterface>("Permission",permissionSchema);

export default permissionModel