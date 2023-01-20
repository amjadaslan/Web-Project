import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import CartService from "./CartService.js";
import { DBPASS, DBUSERNAME, ERROR_401 } from "./const.js";
import jwt from "jsonwebtoken";
import axios, { AxiosResponse } from "axios";
import cookieParser from 'cookie-parser';

const cartService = new CartService();

const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";
const secretKey = process.env.SECRET_KEY || "your_secret_key";

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);



interface RequestWithId_Permission extends Request {
    permission: string;
    actualId: string;
  }

const app = express();

app.use(bodyParser.json());

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
    let cookies = req.headers.cookie.split('; ');
    console.log(cookies);

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

app.use(async (req:RequestWithId_Permission, res, next) => {

    const user = protectedRout(req, res);
    let response: AxiosResponse;
    try {
        response = await axios.get(`${userServiceURL}/api/user/${user.userId}/permission`, { withCredentials: true });
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    if (user != ERROR_401) {
        req.permission = response.data;
        req.actualId = user.userId;
        next();
    }
    else {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "Unauthenticated user",
            })
        );
    }
});


const port = 3002;
app.get('/api/cart/:userid', function (req: RequestWithId_Permission, res: Response) {
    if (req.actualId !== req.params.userid && !['A', 'M', 'W'].includes(req.permission)) {
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    } else { getCart(req, res, req.params.userid); }
});

app.post('/api/cart/:userid', function (req: RequestWithId_Permission, res: Response) {
    if (req.actualId !== req.params.userid) {
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    } else { addToCart(req, res, req.params.userid); }
});

app.put('/api/cart/:userid', function (req: RequestWithId_Permission, res: Response) {
    if (req.actualId !== req.params.userid) {
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    } else { updateCartItem(req, res, req.params.userid); }
});

app.delete('/api/cart/:userid', function (req: RequestWithId_Permission, res: Response) {
    if (req.actualId !== req.params.userid && !['A', 'M', 'W'].includes(req.permission)) {
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    } else { removeCart(req, res, req.params.userid); }
});

app.listen(port, () => { console.log(`Listening to port ${port}`) });


//TODO: #7 Add try\catch to all functions using mongoose methods

//Retrieves the cart of the specified user.
const getCart = async (req: Request, res: Response, userId: string) => {
    let cart;
    try {
        cart = await cartService.getCart(userId);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    if (!cart) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Cart does not exist!" }));
        return;
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
    const prodPrice = req.body.prodPrice;
    if (typeof prodCount != 'number' || typeof prodPrice != 'number' || !Number.isInteger(prodCount)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid Details" }));
        return;
    }
    try {
        await cartService.addToCart(userId, prodCount, prodId, prodPrice);
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
    if (typeof prodCount != 'number' || !Number.isInteger(prodCount)) {
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
}