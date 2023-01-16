import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import UserService from "./userService.js";

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";
const userService = new UserService();

export default (app) => {
  app.post('/api/signup', function (req, res) { signupRoute(req, res); });

  app.post('/api/login', function (req, res) { loginRoute(req, res); });

  app.put('/api/permission', function (req, res) { changePermission(req, res); });

  app.get('/api/:userId/permission', function (req, res) { getPermission(req, res, req.params.userId); });

}

const getPermission = async (req: Request, res: Response, userId: string) => {
  const user = await userService.getUser(userId);
  return user.permission;
}

const loginRoute = (req: Request, res: Response) => {
  // Read request body.
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    // Parse request body as JSON
    let credentials;
    try {
      credentials = JSON.parse(body);
    } catch (err) {
      res.statusCode = 400;
      res.end();
      return;
    }

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
    const user = await userService.getUserByUsername(credentials.username);
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
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: 86400, // expires in 24 hours
    });
    /** check if this is right */
    res.cookie('token', token, {
      httpOnly: true,
      secure: true
    });
    res.end(
      JSON.stringify({
        token: token,
      })
    );
  });
};

const signupRoute = (req: Request, res: Response) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    // Parse request body as JSON
    let credentials;

    try {
      credentials = JSON.parse(body);
    } catch (err) {
      res.statusCode = 400;
      res.end();
      return;
    }

    if (!credentials.username || !credentials.password) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: "Missing username or password.",
        })
      );
      return;
    }
    const alreadyCreated = await userService.getUserByUsername(credentials.username);
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

    try {
      await userService.createUser({ username, password, permission: "U" });
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
  });
};

const changePermission = async (req: Request, res: Response) => {
  if (req.params.permission == "A") {
    // Read request body.
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      // Parse request body as JSON
      let credentials;
      try {
        credentials = JSON.parse(body);
      } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
      }
      if (!credentials.username || !credentials.permission || !["W", "M"].includes(credentials.permission)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Missing permission or username" }));
        return;
      }
      const userToUpdate = await userService.getUserByUsername(credentials.username);
      if (!userToUpdate) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Invalid user.",
          })
        );
        return;
      }
      await userService.changeUserPermission(credentials.username, credentials.permission);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end();
    });
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
