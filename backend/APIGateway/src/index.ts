import express from "express";
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { ERROR_401 } from "./const.js";
import axios, { AxiosResponse } from "axios";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";
const apiGateway = express();
const port = process.env.PORT || 3000;
const productServiceURL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const cartServiceURL = process.env.CART_SERVICE_URL || "http://localhost:3002";
const orderServiceURL = process.env.ORDER_SERVICE_URL || "http://localhost:3003";
const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";

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
  let authHeader = req.headers["authorization"] as string;

  // authorization header needs to look like that: Bearer <JWT>.
  // So, we just take to <JWT>.
  // TODO: You need to validate it.
  let authHeaderSplited = authHeader && authHeader.split(" ");
  const token = authHeaderSplited && authHeaderSplited[1];

  if (!token || authHeaderSplited[0] !== "Bearer") {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "No token or improper form.",
      })
    );
    return ERROR_401;
  }

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
  origin: 'http://localhost:3001',
  credentials: true
}))



apiGateway.use(bodyParser.json());
apiGateway.use(async (req, res, next) => {
  console.log(req.url);
  //Protected route is not relevant for login/signup requests, as no token exists.
  if (req.url === '/api/user/login' || req.url === '/api/user/signup') {
    next();
    return;
  }

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

//Call to UserMicroService
apiGateway.use('/api/user', async (req, res) => {
  console.log("user");
  try {
    // Make the request to the microservice
    await axios({
      method: req.method,
      url: `${userServiceURL}/api/user${req.url}`,
      data: req.body,
      params: req.params,
      withCredentials: true
    }).then(axiosResponse => {
      console.log('Cookie in axios:')
      console.log(axiosResponse.headers['set-cookie'])
      
      console.log('res before:')
      console.log(res.getHeader('set-cookie'))

      res.header('set-cookie', axiosResponse.headers['set-cookie'])

      console.log('res after:')
      console.log(res.getHeader('set-cookie'))
      
      // Send the response back to the client
      res.status(axiosResponse.status).send(axiosResponse.data);
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

//Call to CartMicroService
apiGateway.use('/api/cart', async (req, res) => {
  try {
    // Make the request to the microservice
    const response = await axios({
      method: req.method,
      url: `${cartServiceURL}/api/cart${req.url}`,
      data: req.body,
      headers: req.headers
    });

    // Send the response back to the client
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Call to OrderMicroService
apiGateway.use('/api/order', async (req, res) => {
  try {
    // Make the request to the microservice
    const response = await axios({
      method: req.method,
      url: `${orderServiceURL}/api/order${req.url}`,
      data: req.body,
      headers: req.headers
    });

    // Send the response back to the client
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Call to ProductMicroService
apiGateway.use('/api/product', async (req, res) => {
  try {
    // Make the request to the microservice
    const response = await axios({
      method: req.method,
      url: `${productServiceURL}/api/product${req.url}`,
      data: req.body,
      headers: req.headers
    });

    // Send the response back to the client
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

//TODO: #9 Connect servers to the API Gateway

apiGateway.listen(port, () => {
  console.log(`Gateway APP running! port ${port}`);
});

