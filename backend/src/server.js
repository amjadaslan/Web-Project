import { createServer, IncomingMessage, ServerResponse } from "http";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions

import { DBUSERNAME, DBPASS, LOGIN, SIGNUP } from "./const.js";
import { loginRoute, signupRoute, changePermission } from "./auth.js";
import { getProduct, createProduct, updateProduct, removeProduct } from "./product/productRoutes.js";
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

app.get('/api/product/:idorType', function (req, res) { getProduct(req, res, req.params.idorType); });

app.post('/api/product', function (req, res) { createProduct(req, res); });

app.put('/api/product/:id', function (req, res) { updateProduct(req, res, req.params.id); });

app.delete('/api/product/:id', function (req, res) { removeProduct(req, res, req.params.id); });

app.post('/api/signup', function (req, res) { signupRoute(req, res); });

app.post('/api/login', function (req, res) { loginRoute(req, res); });

app.put('/api/permission', function (req, res) { changePermission(req, res); });

app.listen(port);

console.log(`Server APP running! port ${port}`);