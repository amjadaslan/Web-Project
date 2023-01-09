import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import Users from "./models/userSchema.js";

import { ERROR_401 } from "./const.js";
import { stringify } from "querystring";

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";

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
export const protectedRout = (req: IncomingMessage, res: ServerResponse) => {
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

export const loginRoute = (req: IncomingMessage, res: ServerResponse) => {
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
    const user = await Users.findOne({ username: credentials.username });
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
    const token = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: 86400, // expires in 24 hours
    });

    res.end(
      JSON.stringify({
        token: token,
      })
    );
  });
};

export const signupRoute = (req: IncomingMessage, res: ServerResponse) => {
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
    const alreadyCreated = await Users.findOne({ username: credentials.username });
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
    const user = new Users({ id: uuidv4(), username, password, permission: "W" });

    try { await user.save(); } catch (err) {
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

export const changePermission = async (req: IncomingMessage, res: ServerResponse) => {
  const userID = protectedRout(req, res);
  if (userID) {
    const user = await Users.findOne(userID);
    if (user) {
      if (user.permission == "A") {
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
          const userToUpdate = await Users.findOne({ username: credentials.username });
          if (!userToUpdate) {
            res.statusCode = 401;
            res.end(
              JSON.stringify({
                message: "Invalid user.",
              })
            );
            return;
          }
          userToUpdate.permission = credentials.permission;
          await userToUpdate.save();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end();
          // await Users.updateOne({username: credentials.username}, { $set: {permission: credentials.permission} }).exec();
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
    }
    //No user with this id
  }
  //Invalid token
  res.statusCode = 401;
  res.end(
    JSON.stringify({
      message: "Unauthenticated user",
    })
  );
};
