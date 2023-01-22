import * as mongoose from "mongoose";

const blackListedTokens = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    expires: '24h'
});

blackListedTokens.index({ "createdAt": 1 }, { expireAfterSeconds: 86400 });


const userSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        permission: { type: String, required: true },
        question: { type: String, required: false },
        answer: { type: String, required: false }
    }, { collection: 'UserAuthData' }

);

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
// https://mongoosejs.com/docs/models.html
export const User = mongoose.model("Users", userSchema);
export const BlackListedTokens = mongoose.model("BlackListedTokens", blackListedTokens);
