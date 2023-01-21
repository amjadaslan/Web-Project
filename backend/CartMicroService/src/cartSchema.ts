import * as mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    count: { type: Number, required: true },
    productId: { type: String, required: true }

});

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: [cartItemSchema], required: true }
});


export const CartItem = mongoose.model("CartItem", cartItemSchema);
export const Cart = mongoose.model("Cart", cartSchema);