import express, { Request, Response } from "express";
import OrderService from "./OrderService.js";
import axios, { AxiosResponse } from "axios";
import mongoose from "mongoose";
import { DBUSERNAME, ERROR_401 } from "./const.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ProducerChannel } from './producerChannel.js';

import * as dotenv from "dotenv";
dotenv.config();

interface RequestWithPermission_userId extends Request {
  permission: string;
  userId: string;
}

const orderService = new OrderService();
const producerChannel = new ProducerChannel();

const apiGatewayUrl = process.env.API_GATEWAY_URL || "http://localhost:3005";
const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";
const cartServiceURL = process.env.CART_SERVICE_URL || "http://localhost:3002";
const productServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3001";

const secretKey = process.env.SECRET_KEY || "your_secret_key";
const dbPass = process.env.DBPASS;

const dbUri = `mongodb+srv://${DBUSERNAME}:${dbPass}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
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

const app = express();

app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: true
}))

app.use(async (req: RequestWithPermission_userId, res, next) => {
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
      req.userId = user.userId;
      next();
    })
    .catch((error) => {
      res.statusCode = 500;
      res.end();
      return;
    });

});


const port = 3003;

app.get('/api/order/all', function (req: RequestWithPermission_userId, res: Response) {
  if (!['A', 'M', 'W'].includes(req.permission)) {
    res.statusCode = 403;
    res.end(
      JSON.stringify({
        message: "User has no proper permissions",
      })
    );
    return;
  } else { getAllOrders(req, res); }
});

app.post('/api/order/coupon', bodyParser.json(), function (req: RequestWithPermission_userId, res: Response) {
  console.log("Creating a coupon!");
  if (!['A'].includes(req.permission)) {
    res.statusCode = 403;
    res.end(
      JSON.stringify({
        message: "User has no proper permissions",
      })
    );
    return;
  } else {
    createCoupon(req, res);
  }
});

app.get('/api/order/:orderId', function (req: RequestWithPermission_userId, res: Response) {
  if (!['A', 'M', 'W'].includes(req.permission)) {
    res.statusCode = 403;
    res.end(
      JSON.stringify({
        message: "User has no proper permissions",
      })
    );
    return;
  } else { getOrder(req, res, req.params.orderId); }
});

app.post('/api/order/', bodyParser.json(), function (req: RequestWithPermission_userId, res: Response) {
  createOrder(req, res, req.userId);
});

app.get('/api/order/coupon/:key', async function (req: RequestWithPermission_userId, res: Response) {
  try {
    let val = await orderService.validateCoupon(req.params.key);
    if (val === -1) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ value: val }));
    res.end()
  }
  catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
});



app.put('/api/order/:orderId', function (req: RequestWithPermission_userId, res: Response) {
  if (!['A'].includes(req.permission)) {
    res.statusCode = 403;
    res.end(
      JSON.stringify({
        message: "User has no proper permissions",
      })
    );
    return;
  } else { markAsDelivered(req, res, req.params.orderId); }
});

app.use(function (req: Request, res: Response) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found!s' }));
  return;
});

app.listen(port, () => { console.log(`Listening to port ${port}`) });

const createCoupon = async (req: Request, res: Response) => {
  let coupon = req.body;
  try {
    await orderService.createCoupon(coupon.key, coupon.value);
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
  res.statusCode = 201;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(coupon));
  return;

};

const getAllOrders = async (req: Request, res: Response) => {
  let orders;
  try { orders = await orderService.getAllOrders(); } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(orders));
  return;
}

const getOrder = async (req: Request, res: Response, orderId: string) => {
  let order;
  try { order = await orderService.getOrder(orderId); } catch (err) {
    res.statusCode = 500;
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


//TODO: #23 Fix createOrder edge cases
const createOrder = async (req: Request, res: Response, userId: string) => {
  console.log("Creating Order...");
  let order;
  try {
    //grab customer's name using his id
    // let response = await axios.get(`${userServiceURL}/api/user/${userId}/username`, { withCredentials: true });
    const customerName = req.body.name;

    //address data from body
    const streetAddress = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const zipCode = req.body.zip;

    //coupon if available
    const coupon = req.body.coupon;

    console.log("Validating Coupon..");
    let couponVal = await orderService.validateCoupon(coupon);


    console.log("getting Cart...");
    let cartRes: AxiosResponse;
    cartRes = await axios.get(`${cartServiceURL}/api/cart/`, { headers: req.headers });
    const cart = cartRes.data;
    //TODO: #2 Verify Item in stock before placing an order
    console.log("Validating Quantity..");
    for (let item of cart.items) {
      const productRes = await axios.get(`${productServiceURL}/api/product/${item.productId}`, { headers: req.headers });
      const product = productRes.data;
      if (product.stock < item.count) {
        //TODO: #3 find a proper error code for each failed task
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Not enough items in stock!" }));
        return;
      }
    }

    const cc = req.body.cardNumber;
    const holder = req.body.cardHolder;
    const cvv = req.body.cvv;
    const exp = req.body.expiryDate;
    let charge = couponVal === -1 ? cart.total : cart.total - couponVal;
    if (charge < 0) charge = 0;

    //TODO: #22 send payment request via api call to hammerheadprovider

    console.log("Performing Payment..");
    try {
      await axios.post('https://www.cs-wsp.net/_functions/pay', { cc, holder, cvv, exp, charge });
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end({ message: "Server error! Order could not be created." });
      return;
    }


    console.log("Creating Order Instance..");
    //creates an order into mongodb
    order = await orderService.createOrder({ customerName, streetAddress, city, state, country, zipCode });

    if (!order) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end({ message: "Error! Order could not be created." });
      return;
    }

    //TODO: #5 Update stock for all items in order.
    try {
      console.log("Updating Stock..");
      await producerChannel.sendEvent(JSON.stringify({ items: cart.items }));
    } catch (err) {
      res.statusCode = 500;
      res.end({ message: "Error! No enough left in stock." });
      return;
    }
    console.log("Removing Cart..");
    await axios.delete(`${cartServiceURL}/api/cart/`, { headers: req.headers });
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
  console.log(orderId);
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