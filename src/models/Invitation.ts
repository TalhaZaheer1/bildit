import mongoose,{ Document,Schema } from "mongoose";
import { Role } from "@/lib/types";

enum InvitationStatus{
    ACCEPTED="ACCEPTED",
    REVOKED="REVOKED",
    PENDING="PENDING"
}

export interface InvitationInterface extends Document {
    email: string;
    agency: mongoose.Schema.Types.ObjectId | string;
    role: Role;
    status: InvitationStatus;
    createdAt: Date;
    updatedAt: Date;
  }

const invitationSchema: Schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    agency:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Agency",
        index:true,
        required:true
    },
    role:{
        type:String,
        default:"SUBACCOUNT_USER",
        enum:["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]
    },
    status:{
        type:String,
        default:InvitationStatus.PENDING,
        enum:["ACCEPTED","REVOKED","PENDING"]
    }
},{ timestamps:true  });

const invitationModel = mongoose.models["Invitation"] || mongoose.model<InvitationInterface>("Invitation",invitationSchema);

export default invitationModel;