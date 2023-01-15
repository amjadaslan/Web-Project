import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import Product from "../models/productSchema.js";
import { protectedRout } from "./authAPI.js";
import {User} from "../models/userSchema.js";
import { ERROR_401 } from "../const.js";
import { v4 as uuidv4 } from "uuid";
import ProductService from "../Services/ProductService.js";
import UserService from "../Services/userService.js";


const productService = new ProductService();
const userService = new UserService();

export default (app) => {

}


export const updateCart = async (req: IncomingMessage, res: ServerResponse) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await userService.getUser(userId.userId);
        if (user) {
            if (user.permission === "U" ) {
                // Read request body.
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });
                req.on("end", async () => {
                    // Parse request body as JSON
                    try {
                        let { count, prodId } = JSON.parse(body);
                        user.cart.push({count,prodId});
                        try { await user.save(); } catch (err) {
                            res.statusCode = 400;
                            res.end();
                            return;
                        }

                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.end();
                        return;
                    } catch (err) {
                        res.statusCode = 400;
                        res.end();
                        return;
                    }

                    // Mongoose will automatically insert this document to our collection!

                });
                return;
            }
            //No Authorization to change permission
            else {
                res.statusCode = 403;
                res.end(
                    JSON.stringify({
                        message: "User has no proper permissions",
                    })
                );
                return;
            }
        }
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "Unauthenticated user",
            })
        );
    }
}