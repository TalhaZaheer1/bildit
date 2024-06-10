import mongoose, { Document, Schema } from "mongoose";
import { AgencyInterface } from "./Agency";
import { SubAccountInterface } from "./SubAccount";
import { UserInterface } from "./User";
const {
  Types: { ObjectId },
} = mongoose;

export interface NotificationInterface extends Document{
  notification:string,
  agency: typeof ObjectId | AgencyInterface | string,
  subAccount:  typeof ObjectId | SubAccountInterface | string,
  user:  typeof ObjectId | UserInterface | string
}

const notificationSchema: Schema = new mongoose.Schema({
    notification: {
      type: String,
      required: true,
    },
    agency: {
      type: ObjectId,
      ref: 'Agency', // Reference the Agency model
      index:true
    },
    subAccount: {
      type: ObjectId,
      ref: 'SubAccount', // Reference the SubAccount model (optional)
      index:true
    },
    user: {
      type: ObjectId,
      required: true,
      ref: 'User', // Reference the User model
      index:true
    },
},{ timestamps:true });

const notificationModel = mongoose.models["Notification"] ||  mongoose.model<NotificationInterface>("Notification",notificationSchema);

export default notificationModel