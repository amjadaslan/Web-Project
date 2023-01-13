import * as mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    streetAddress: {type:String,required:true},
    apartment:{type:String},
    city: {type:String,required:true},
    state: {type:String,required:true},
    country: {type:String,required:true},
    zipCode: {type:String,required:true}
});

export default mongoose.model("address", addressSchema);