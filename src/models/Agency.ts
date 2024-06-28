import mongoose, { Document, Schema } from "mongoose";
import { Role } from "@/lib/types";
import { UserInterface } from "./User";
import { SubAccountInterface } from "./SubAccount";
import { InvitationInterface } from "./Invitation";
import { SubscriptionInterface } from "./Subscription";
import "./Subscription"
export interface AgencyInterface extends Document {
  connectAccountId?: string;
  customerId: string;
  name: string; // Required
  agencyLogo?: string; // Optional
  companyEmail: string; // Required
  companyPhone?: string;
  whiteLabel?: boolean; // Defaults to true
  address?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  country?: string;
  goal?: number;
  users?: mongoose.Schema.Types.ObjectId[] | UserInterface[];
  subAccounts?: mongoose.Schema.Types.ObjectId[] | SubAccountInterface[];
  sidebarOptions?:{
    name:string,
    link:string,
    icon:string
  }[];
  invitations?: mongoose.Schema.Types.ObjectId[] | InvitationInterface[];
  subscription?: mongoose.Schema.Types.ObjectId | SubscriptionInterface;
  addons?: mongoose.Schema.Types.ObjectId[];
}

const agencySchema: Schema = new mongoose.Schema(
  {
    connectAccountId: {
      type: String,
      default: "",
    },
    customerId: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    agencyLogo: String,
    companyEmail: {
      type: String,
      required: true,
    },
    companyPhone: String,
    whiteLabel: {
      type: Boolean,
      default: true,
    },
    address: String,
    city: String,
    zipCode: String,
    state: String,
    country: String,
    goal: Number,
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    subAccounts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SubAccount",
    },
    sidebarOptions: [
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
    invitations: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Invitation",
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    addons: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "AddOns ",
    },
  },
  { timestamps: true }
);

const agencyModel =
  mongoose.models["Agency"] ||
  mongoose.model<AgencyInterface>("Agency", agencySchema);

export default agencyModel;
