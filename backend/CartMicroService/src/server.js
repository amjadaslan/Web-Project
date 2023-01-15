import { createServer, IncomingMessage, ServerResponse } from "http";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions

import { DBUSERNAME, DBPASS, LOGIN, SIGNUP } from "./const.js";
import { loginRoute, signupRoute, changePermission } from "./auth.js";
import Users from "./models/userSchema.js";
import { v4 as uuidv4 } from "uuid";

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);
const admin = await Users.findOne({ username: "admin" });
if (!admin) {
    const cryptedPass = await bcrypt.hash("admin", 10);
    const newAdmin = new Users({ id: uuidv4(), username: "admin", password: cryptedPass, permission: "A" });
    newAdmin.save();
}

import express from "express";
const app = express()

const port = process.env.PORT || 3000;

app.listen(port);

console.log(`Server APP running! port ${port}`);