import * as mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    count: { type: Number, required: true },
    productId: { type: String, required: true }
});

export default mongoose.model("cartItem", cartItemSchema);