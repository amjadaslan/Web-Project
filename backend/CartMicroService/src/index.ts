import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import CartService from "./CartService.js";
import { DBUSERNAME, ERROR_401 } from "./const.js";
import jwt from "jsonwebtoken";
import axios, { AxiosResponse } from "axios";
import cookieParser from 'cookie-parser';

import * as dotenv from "dotenv";
dotenv.config();

const cartService = new CartService();


const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";
const dbPass = process.env.DBPASS;
const secretKey = process.env.SECRET_KEY || "your_secret_key";

const dbUri = `mongodb+srv://${DBUSERNAME}:${dbPass}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);



interface RequestWithId_Permission extends Request {
    permission: string;
    actualId: string;
}

const app = express();


app.use(cookieParser());

// Verify JWT token
const verifyJWT = (token: string) => {
    try {
        return jwt.verify(token, secretKey);
        // Read more here: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        // Read about the diffrence between jwt.verify and jwt.decode.
    } catch (err) {
        return false;
    }
};

// Middelware for all protected routes. You need to expend it, implement premissions and handle with errors.
const protectedRout = (req: Request, res: Response) => {
    if (req.headers.cookie == undefined) {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "No token or improper form.",
            })
        );
        return ERROR_401;
    }
    let cookies = req.headers.cookie.split('; ');

    // We get the token value from cookies.
    if (cookies.filter(str => str.startsWith("token")).length != 1) {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "No token or improper form.",
            })
        );
        return ERROR_401;
    }
    const token = cookies.find(str => str.startsWith("token")).substring("token=".length);

    // Verify JWT token
    const user = verifyJWT(token);
    if (!user) {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "Failed to verify JWT.",
            })
        );
        return ERROR_401;
    }

    // We are good!
    return user;
};


app.use(async (req: RequestWithId_Permission, res, next) => {
    console.log(req.url);
    const user = protectedRout(req, res);
    if (user == ERROR_401) { return; }
    console.log("getting permission..");

    await axios
        .get(`${userServiceURL}/api/user/${user.userId}/permission`, {
            headers: {
                cookie: req.headers.cookie
            }
        }).then(response => {
            console.log("received permission..");
            req.permission = response.data.permission;
            req.actualId = user.userId;
            next();
        })
        .catch((error) => {
            res.statusCode = 500;
            res.end();
            return;
        });

});


const port = 3002;
app.get('/api/cart/', function (req: RequestWithId_Permission, res: Response) {

    getCart(req, res, req.actualId);
});

app.post('/api/cart/', bodyParser.json(), function (req: RequestWithId_Permission, res: Response) {
    addToCart(req, res, req.actualId);
});

app.put('/api/cart/', bodyParser.json(), function (req: RequestWithId_Permission, res: Response) {
    updateCartItem(req, res, req.actualId);
});


app.put('/api/cart/item/', bodyParser.json(), function (req: RequestWithId_Permission, res: Response) {
    removeCartItem(req, res, req.actualId);
});


app.delete('/api/cart/', function (req: RequestWithId_Permission, res: Response) {
    removeCart(req, res, req.actualId);
});

app.use(function (req: Request, res: Response) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found!s' }));
    return;
});

app.listen(port, () => { console.log(`Listening to port ${port}`) });

//TODO: #7 Add try\catch to all functions using mongoose methods

const removeCartItem = async (req: Request, res: Response, userId: string) => {
    const prodId = req.body.prodId;
    try { await cartService.removeCartItem(userId, prodId); } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end();
    return;

}

//Retrieves the cart of the specified user.
const getCart = async (req: Request, res: Response, userId: string) => {
    let cart;
    try {
        cart = await cartService.getCart(userId);
    } catch (err) {

        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Cart does not exist!" }));
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(cart));
    return;
}

//Adds an item to the cart of the specified user.
const addToCart = async (req: Request, res: Response, userId: string) => {
    const prodId = req.body.prodId;
    const prodCount = req.body.prodCount;
    if (typeof prodCount != 'number' || !Number.isInteger(prodCount) || prodCount < 0) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid Details" }));
        return;
    }
    try {
        await cartService.addToCart(userId, prodCount, prodId);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end();
}

//Updates the specified item in the cart of the specified user.
const updateCartItem = async (req: Request, res: Response, userId: string) => {
    const prodId = req.body.prodId;
    const prodCount = req.body.prodCount;
    if (typeof prodCount != 'number' || !Number.isInteger(prodCount) || prodCount < 0) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid Details" }));
        return;
    }
    try {
        await cartService.updateCartItem(userId, prodCount, prodId);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end();
}

//Removes a cart of the specified user.
const removeCart = async (req: Request, res: Response, userId: string) => {
    try { await cartService.removeCart(userId); } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end();
    return;
}