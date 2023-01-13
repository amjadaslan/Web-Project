import * as mongoose from "mongoose";
import cartItemSchema from "./cartItemSchema.js";

// Creating new Schema object
// Each propery have type filed - https://mongoosejs.com/docs/schematypes.html
// And requierd files if needed
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
export default mongoose.model("users", userSchema);