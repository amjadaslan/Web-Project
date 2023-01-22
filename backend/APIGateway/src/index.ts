import express, { Request, Response } from "express";
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { ERROR_401 } from "./const.js";
import axios from "axios";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

axios.defaults.withCredentials = true;

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";
const apiGateway = express();

const port = process.env.PORT || 3005;

const frontEndUrl = process.env.PRODUCT_SERVICE_URL || "http://localhost:3000";
const productServiceURL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const cartServiceURL = process.env.CART_SERVICE_URL || "http://localhost:3002";
const orderServiceURL = process.env.ORDER_SERVICE_URL || "http://localhost:3003";
const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";

//TODO: #16 Move protectedrout inside each Microserver
//TODO: #17 Add CORS to each microserver

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
const protectedRout = (req: IncomingMessage, res: ServerResponse) => {
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

apiGateway.use(cookieParser());

//Alow cross origin requests
//TODO: #13 Only allow cross origin from Front end url?
apiGateway.use(cors({
  origin: frontEndUrl,
  credentials: true
}))


 
apiGateway.use(bodyParser.json());

const connect = async (serviceType: string, serviceURL: string) => {
  apiGateway.use(`/api/${serviceType}`, async (req, res) => {
    try {
      console.log(req.url);
      // Make the request to the microservice
      const response = await axios({
        method: req.method,
        url: `${serviceURL}/api/${serviceType}${req.url}`,
        data: req.body,
        headers: req.headers
      });

      if (req.url == '/login') {
        res.header('set-cookie', response.headers['set-cookie'])
      }

      // Send the response back to the client
      res.status(response.status).send(response.data);
    } catch (err) {
      res.status(err.status?err.status:500).send(err);
    }
  });
}

//Call to UserMicroService
connect('user', userServiceURL);

//Call to CartMicroService
connect('cart', cartServiceURL);

//Call to OrderMicroService
connect('order', orderServiceURL);

//Call to ProductMicroService
connect('product', productServiceURL);

apiGateway.use(function (req: Request, res: Response) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found!s' }));
  return;
});

//TODO: #9 Connect servers to the API Gateway

apiGateway.listen(port, () => {
  console.log(`Gateway APP running! port ${port}`);
});

