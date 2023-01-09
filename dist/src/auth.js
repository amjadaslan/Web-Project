import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ERROR_401 } from "./const.js";
// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";
// TODO: Replace with your user database
const users = [];
export let permission;
// Verify JWT token
const verifyJWT = (token) => {
    try {
        return jwt.verify(token, secretKey);
        // Read more here: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        // Read about the diffrence between jwt.verify and jwt.decode.
    }
    catch (err) {
        return false;
    }
};
// Middelware for all protected routes. You need to expend it, implement premissions and handle with errors.
export const protectedRout = (req, res) => {
    let authHeader = req.headers["authorization"];
    // authorization header needs to look like that: Bearer <JWT>.
    // So, we just take to <JWT>.
    // TODO: You need to validate it.
    let authHeaderSplited = authHeader && authHeader.split(" ");
    const token = authHeaderSplited && authHeaderSplited[1];
    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({
            message: "No token.",
        }));
        return ERROR_401;
    }
    // Verify JWT token
    const user = verifyJWT(token);
    if (!user) {
        res.statusCode = 401;
        res.end(JSON.stringify({
            message: "Failed to verify JWT.",
        }));
        return ERROR_401;
    }
    // We are good!
    return user;
};
export const loginRoute = (req, res) => {
    // Read request body.
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        // Parse request body as JSON
        const credentials = JSON.parse(body);
        // TODO: validate that the body has the "shape" you are expect: { username: <username>, password: <password>}
        // Check if username and password match
        const user = users.find((u) => u.username === credentials.username);
        if (!user) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                message: "Invalid username or password.",
            }));
            return;
        }
        // bcrypt.hash create single string with all the informatin of the password hash and salt.
        // Read more here: https://en.wikipedia.org/wiki/Bcrypt
        // Compare password hash & salt.
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                message: "Invalid username or password.",
            }));
            return;
        }
        // Create JWT token.
        // This token contain the userId in the data section.
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: 86400, // expires in 24 hours
        });
        res.end(JSON.stringify({
            token: token,
        }));
    });
};
export const signupRoute = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        // Parse request body as JSON
        const credentials = JSON.parse(body);
        // TODO: you need to validate the request.
        const username = credentials.username;
        const password = await bcrypt.hash(credentials.password, 10);
        users.push({ id: uuidv4(), username, password, permission: "W" });
        res.statusCode = 201; // Created a new user!
        res.end(JSON.stringify({
            username,
        }));
    });
};
export const changePermission = (req, res, perm) => {
};
//# sourceMappingURL=auth.js.map