import * as mongoose from "mongoose";

enum DeliveryStatus {
    Pending = 0, 
    Delivered = 1
}
const addressSchema = new mongoose.Schema({
    streetAddress: {type:String,required:true},
    apartment:{type:String},
    city: {type:String,required:true},
    state: {type:String,required:true},
    country: {type:String,required:true},
    zipCode: {type:String,required:true}
});

const orderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        customerName: { type: String, required: true },
        address: {type:addressSchema, required: true},
        status:{type: DeliveryStatus, required: true}
    }, { collection: 'Orders' }

);

export default mongoose.model("order", orderSchema);