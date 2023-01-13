import * as mongoose from "mongoose";
import addressSchema from "./addressSchema.js";

enum DeliveryStatus {
    Pending = 0, 
    Delivered = 1
}


const orderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        customerName: { type: String, required: true },
        address: {type:addressSchema, required: true},
        status:{type: DeliveryStatus, required: true}
    }, { collection: 'Orders' }

);

export default mongoose.model("order", orderSchema);