import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import express from "express";
import { DBUSERNAME, DBPASS, ERROR_401} from "./const.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import UserService from "./userService.js";
import mongoose, { RootQuerySelector } from "mongoose";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);


const secretKey = process.env.SECRET_KEY || "your_secret_key";
const userService = new UserService();
const app = express();
const port = 3004;

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

app.use(cookieParser());


const admin = await userService.getUserByUsername("admin");
if (!admin) {
  await userService.createAdmin();
}

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(async (req, res, next) => {
  console.log(req.url);
  //Protected route is not relevant for login/signup requests, as no token exists.
  if (req.url === '/api/user/login' || req.url === '/api/user/signup') {
    next();
    return;
  }

  const userRes = protectedRout(req, res);
  let userData;
  try {
    userData = await userService.getUser(userRes.userId);
  } catch (err) {
    res.statusCode = 400;
    res.end();
    return;
  }
  if (userData != ERROR_401) {
    req.params.permission = userData.permission;
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
