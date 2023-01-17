import * as mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    count: { type: Number, required: true },
    productId: { type: String, required: true },
    price: {type: Number, required:true}
    
});

const cartSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: {type: [cartItemSchema] , required:true},
    total: {type: Number, default:0}
});


export const CartItem = mongoose.model("CartItem",cartItemSchema);
export const Cart = mongoose.model("Cart",cartSchema);