import mongoose, { Document, Schema,ObjectId } from "mongoose";
import { Role } from "@/lib/types";
import { AgencyInterface } from "./Agency";
import "./Permission";
import { PermissionInterface } from "./Permission";

export interface UserInterface extends Document {
  _id:ObjectId | string;
  name: string;
  avatarUrl?: string;
  email: string;
  role: Role;
  agency: ObjectId | AgencyInterface; // Optional since ref is set
  permissions?: mongoose.Schema.Types.ObjectId[] | PermissionInterface[]; // Optional since ref is set
  tickets?: ObjectId[]; // Optional since ref is set
  notifications?: ObjectId[]; // Optional since ref is set
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    email: {
      type: String,
      required: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    role: {
      type: String,
      default: "SUBACCOUNT_USER",
      enum:["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"],
      required:true
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      index: true,
    },
    permissions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Permission",
    },
    tickets: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ticket",
    },
    notifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Notificaiton",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models["User"] || mongoose.model<UserInterface>("User", userSchema);

export default userModel;
