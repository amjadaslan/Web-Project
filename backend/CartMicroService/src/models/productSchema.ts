import * as mongoose from "mongoose";

// Everything in Mongoose starts with a Schema.
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

// Creating new Schema object
// Each propery have type filed - https://mongoosejs.com/docs/schematypes.html
// And requierd files if needed
const productSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: { type: String }
    }, { collection: 'Products' }

);

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
// https://mongoosejs.com/docs/models.html
export default mongoose.model("product", productSchema);