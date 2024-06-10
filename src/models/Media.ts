import mongoose, { Document, Schema, mongo } from "mongoose";
const {
  Types: { ObjectId },
} = mongoose;

export interface MediaInterface extends Document {
  type?: string; // 'type' is optional as it is not marked as required in the schema
  name: string;
  link: string;
  subAccount: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date; // Added by 'timestamps: true'
  updatedAt: Date; // Added by 'timestamps: true'
}

const mediaSchema: Schema = new mongoose.Schema(
  {
    type: String,
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
    },
    subAccount: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubAccount", // Reference the SubAccount model
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models["Media"] ||
  mongoose.model<MediaInterface>("Media", mediaSchema);
