import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { protectedRout } from "./authAPI.js";
import { User } from "../models/userSchema.js";
import { ERROR_401 } from "../const.js";
import ProductService from "../Services/ProductService.js";
import UserService from "../Services/userService.js";

const validCategories = ["t-shirt", "hoodie", "hat", "necklace", "bracelet", "shoes", "pillow", "mug", "book", "puzzle", "cards"];

const productService = new ProductService();
const userService = new UserService();

export default (app) => {
    app.get('/api/product/:idorType', function (req, res) { getProduct(req, res, req.params.idorType); });

    app.post('/api/product', function (req, res) { createProduct(req, res); });

    app.put('/api/product/:id', function (req, res) { updateProduct(req, res, req.params.id); });

    app.delete('/api/product/:id', function (req, res) { removeProduct(req, res, req.params.id); });


}

const getProduct = async (req: IncomingMessage, res: ServerResponse, idOrType: string) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await userService.getUser(userId.userId);
        if (user) {
            //We try to interpret input as Id. If that fails, we interpret as category
            const product = await productService.getProductById(idOrType);
            if (!product) {
                const products = await productService.getProductsByCategory(idOrType);
                if (products.length == 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Product Not Found' }));
                    return;
                }
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(products));
                    return;
                }
            }
            else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(product));
            }
            return;
        }
    }

};


const createProduct = async (req: IncomingMessage, res: ServerResponse) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await userService.getUser(userId.userId);
        if (user) {
            if (["A", "M"].includes(user.permission)) {
                // Read request body.
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });
                req.on("end", async () => {
                    // Parse request body as JSON
                    try {
                        let { name, category, description, price, stock, image } = JSON.parse(body);
                        if (!name || !category || !description || !price || !stock || typeof price != 'number' || typeof stock != 'number' || !Number.isInteger(stock) || stock < 0 || price < 0 || price > 1000 || !validCategories.includes(category)) {

                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Invalid Details' }));
                            return;
                        }
                        let prodId;
                        try { prodId = await productService.createProduct({ name, category, description, price, stock, image }); } catch (err) {
                            res.statusCode = 400;
                            res.end();
                            return;
                        }

                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ id: prodId }));
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


};

const updateProduct = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await userService.getUser(userId.userId);
        if (user) {
            if (["A", "M"].includes(user.permission)) {
                const prod = await productService.getProductById(id);
                if (!prod) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Product Not Found' }));
                    return;
                }
                else {
                    // Read request body.
                    let body = "";
                    req.on("data", (chunk) => {
                        body += chunk.toString();
                    });
                    req.on("end", async () => {
                        // Parse request body as JSON
                        try {
                            JSON.parse(body);
                        } catch (err) {
                            res.statusCode = 400;
                            res.end();
                            return;
                        }
                        const { name, category, description, price, stock, image } = JSON.parse(body);
                        if ((!name && !category && !description && !price && !stock && !image) ||
                            typeof price != 'number' || typeof stock != 'number' || !Number.isInteger(stock) || stock < 0 || price < 0 || price > 1000 || !validCategories.includes(category)) {

                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Invalid Details' }));
                            return;
                        }

                        await productService.updateProduct({ id, name, category, description, price, stock, image })

                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ id: id }));
                        return;

                    });
                    return;
                }
            }
            else {//No Authorization to change permission
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

const removeProduct = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await userService.getUser(userId.userId);
        if (user) {
            if (user.permission == "A") {
                await productService.removeProduct(id);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end();
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
        } else {
            res.statusCode = 401;
            res.end(
                JSON.stringify({
                    message: "Unauthenticated user",
                })
            );
        }

    }

}
