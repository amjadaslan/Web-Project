import * as mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    count: { type: Number, required: true },
    productId: { type: String, required: true }
});

const userSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        permission: { type: String, required: true },
        cart: {type: [cartItemSchema],required: true}
    }, { collection: 'UserAuthData' }

);

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
// https://mongoosejs.com/docs/models.html
export const User =  mongoose.model("Users", userSchema);
export const CartItem = mongoose.model("CartItem",cartItemSchema);