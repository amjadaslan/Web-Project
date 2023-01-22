import * as mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
});

const orderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        customerName: { type: String, required: true },
        address: { type: addressSchema, required: true },
        status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' }
    }, { collection: 'Orders' }

);

const couponSchema = new mongoose.Schema({ key: { type: String, required: true }, value: { type: Number, required: true } }, { collection: 'Coupons' });

export const Order = mongoose.model("order", orderSchema);
export const Address = mongoose.model("address", addressSchema);
export const Coupon = mongoose.model("coupon", couponSchema);