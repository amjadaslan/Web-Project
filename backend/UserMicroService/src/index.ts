import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import express from "express";
import { DBUSERNAME, DBPASS } from "./const.js";
import cors from 'cors';

import UserService from "./userService.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);

const frontEndUrl = process.env.PRODUCT_SERVICE_URL || "http://localhost:3000";
const apiGatewayUrl = process.env.API_GATEWAY_URL || "http://localhost:3005";


const secretKey = process.env.SECRET_KEY || "your_secret_key";
const userService = new UserService();
const app = express();
const port = 3004;

const admin = await userService.getUserByUsername("admin");
if (!admin) {
  await userService.createAdmin();
}

app.use(bodyParser.json());

app.use(cors({
  origin: apiGatewayUrl,
  credentials: true
}))

app.post('/api/user/signup', function (req, res) { signupRoute(req, res); });

app.post('/api/user/login', function (req, res) { loginRoute(req, res); });

app.put('/api/user/permission', function (req, res) { changePermission(req, res); });

app.get('/api/user/:userId/permission', function (req, res) { getPermission(req, res, req.params.userId); });

app.listen(port, () => { console.log(`Listening to port ${port}`) });

const getPermission = async (req: Request, res: Response, userId: string) => {
  console.log(userId);
  let user;
  try {
    user = await userService.getUser(userId);
  } catch (err) {
    res.statusCode = 400;
    res.end();
    return;
  }
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      permission:
        user.permission
    })
  );
}

//TODO: #10 Save token in a proper format (cookies)
const loginRoute = async (req: Request, res: Response) => {
  console.log("login");
  // Read request body.
  let credentials = req.body;

  // TODO: validate that the body has the "shape" you are expect: { username: <username>, password: <password>}
  if (!credentials.username || !credentials.password) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: "Missing username or password.",
      })
    );
    return;
  }

  // Check if username and password match
  let user;
  try { user = await userService.getUserByUsername(credentials.username); } catch (err) {
    res.statusCode = 400;
    res.end();
    return;
  }
  if (!user) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "Invalid username or password.",
      })
    );
    return;
  }

  // bcrypt.hash create single string with all the informatin of the password hash and salt.
  // Read more here: https://en.wikipedia.org/wiki/Bcrypt
  // Compare password hash & salt.
  const passwordMatch = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!passwordMatch) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "Invalid username or password.",
      })
    );
    return;
  }

  // Create JWT token.
  // This token contain the userId in the data section.
  const token = jwt.sign({ userId: user.userId }, secretKey, {
    expiresIn: 86400, // expires in 24 hours
  });
  
  /** check if this is right */
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.end(
    // JSON.stringify({
    //   token: token,
    // }
    );
};

const signupRoute = async (req: Request, res: Response) => {
  console.log('signup');
  let credentials = req.body;

  if (!credentials.username || !credentials.password) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: "Missing username or password.",
      })
    );
    return;
  }
  let alreadyCreated;
  try {
    alreadyCreated = await userService.getUserByUsername(credentials.username);
  } catch (err) {
    res.statusCode = 400;
    res.end();
    return;
  }
  if (alreadyCreated) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: "User already exists!",
      })
    );
    return;
  }
  const username = credentials.username;
  const password = await bcrypt.hash(credentials.password, 10);

  const question = credentials.question;
  const answer = await bcrypt.hash(credentials.answer, 10);

  try {
    await userService.createUser({ username, password, permission: "U", question, answer });
  } catch (err) {
    res.statusCode = 400;
    res.end();
    return;
  }

  res.statusCode = 201; // Created a new user!
  res.end(
    JSON.stringify({
      username,
    })
  );
  // });
};

const changePermission = async (req: Request, res: Response) => {
  if (req.params.permission == "A") {
    // Read request body.
    let credentials = req.body;
    if (!credentials.username || !credentials.permission || !["W", "M"].includes(credentials.permission)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Missing permission or username" }));
      return;
    }
    let userToUpdate;
    try {
      userToUpdate = await userService.getUserByUsername(credentials.username);
    } catch (err) {
      res.statusCode = 400;
      res.end();
      return;
    }
    if (!userToUpdate) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          message: "Invalid user.",
        })
      );
      return;
    }
    try {
      await userService.changeUserPermission(credentials.username, credentials.permission);
    } catch (err) {
      res.statusCode = 400;
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end();
    // });
    return;
  }
  //No Authorization to change permission
  res.statusCode = 403;
  res.end(
    JSON.stringify({
      message: "User has no proper permissions",
    })
  );
  return;

};
