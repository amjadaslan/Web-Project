import express, { Request, Response } from "express";
import OrderService from "./OrderService.js";
import axios, { AxiosResponse } from "axios";
import mongoose from "mongoose";
import { DBPASS, DBUSERNAME,ERROR_401 } from "./const.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';


const orderService = new OrderService();

const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";
const secretKey = process.env.SECRET_KEY || "your_secret_key";
const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);
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

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());

app.use(async (req, res, next) => {
    
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
      req.params.permission = response.data;
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


const port = 3003;

app.get('/api/order/:orderId', function (req: Request, res: Response) { getOrder(req, res, req.params.orderId); });

app.post('/api/order/:username', function (req: Request, res: Response) { createOrder(req, res, req.params.username); });

app.put('/api/order/:orderId', function (req: Request, res: Response) { markAsDelivered(req, res, req.params.orderId); });

app.listen(port, () => { console.log(`Listening to port ${port}`) });


const getOrder = async (req: Request, res: Response, orderId: string) => {
    let order;
    try { order = await orderService.getOrder(orderId); } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    if (!order) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Order does not exist!" }));
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(order));
    return;
}


const createOrder = async (req: Request, res: Response, userName: string) => {
    const customerName = userName;
    const streetAddress = req.body.streetAddress;
    const apartment = req.body.apartment;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const zipCode = req.body.zipCode;
    const userId = req.body.userId;
    const coupon = req.body.coupon;
    let order;
    try {
        order = await orderService.createOrder({ customerName, streetAddress, apartment, city, state, country, zipCode });

        if (!order) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end({ message: "Error! Order could not be created." });
            return;
        }

        let cartRes: AxiosResponse;
        cartRes = await axios.get(`${process.env.CART}/api/cart/${userId}`);
        const cart = cartRes.data.cart;
        //TODO: #2 Verify Item in stock before placing an order
        for (let item of cart.items) {
            const productRes = await axios.get(`${process.env.PRODUCT}/api/product/${item.productId}`);
            const product = productRes.data.product;
            if (product.stock < item.count) {
                //TODO: #3 find a proper error code for each failed task
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Not enough items in stock!" }));
                return;
            }
        }

        //TODO: #5 Update stock for all items in order.
        for (let item of cart.items) {
            const productRes = await axios.get(`${process.env.PRODUCT}/api/product/${item.productId}`);
            const product = productRes.data.product;
            const newStock = product.stock - item.count;
            await axios.put(`${process.env.PRODUCT}/api/product/${item.productId}`, { newStock });
        }
        await axios.delete(`${process.env.CART}/api/cart/${userId}`);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ id: order.id }));
    return;

}

//TODO: #6 Mark order as delivered once employee submits a request
const markAsDelivered = async (req: Request, res: Response, orderId: string) => {
    let order;
    try {
        order = await orderService.getOrder(orderId);
        if (!order) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Order does not exist!" }));
            return;
        }
        await orderService.markAsDelivered(orderId);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ id: order.id }));
    return;
}