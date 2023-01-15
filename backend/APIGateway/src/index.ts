import express from "express";
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { ERROR_401 } from "./const.js";
import axios  from "axios";

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";
const apiGateway = express();
const port = process.env.PORT || 3000;
const productServiceURL = process.env.PRODUCT_SERVICE_URL || "";
const userServiceURL = process.env.USER_SERVICE_URL || "";

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

apiGateway.use(async (req, res, next) => {
  const user = protectedRout(req, res);
  const response = await axios.get(`${userServiceURL}/api/${user.userId}/permission`);
  if (user != ERROR_401) {
    req.params.permission = response.data;
    next()
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


apiGateway.listen(port, () => {
  console.log(`Gateway APP running! port ${port}`);
});

