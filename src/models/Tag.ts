import mongoose,{Document} from "mongoose";

export interface TagInterface extends Document{
    name:string,
    color:string,
    createdAt:string,
    updatedAt:string,
    subAccount:string
}

const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    subAccount:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubAccount"
    }
},{timestamps:true})

const TagModal = mongoose.models["Tag"] || mongoose.model<TagInterface>("Tag",tagSchema)

export default TagModal