import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import Product from "../models/productSchema.js";
import { protectedRout } from "../auth.js";
import Users from "../models/userSchema.js";
import { ERROR_401 } from "../const.js";
import { v4 as uuidv4 } from "uuid";

const validCategories = ["t-shirt", "hoodie", "hat", "necklace", "bracelet", "shoes", "pillow", "mug", "book", "puzzle", "cards"];

export const getProduct = async (req: IncomingMessage, res: ServerResponse, idOrType: string) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await Users.findOne(userId);
        if (user) {
            //We try to interpret input as Id. If that fails, we interpret as category
            const product = await Product.findOne({ id: idOrType }).select('-__v -_id');
            if (!product) {
                const products = await Product.find({ category: idOrType }).select('-__v -_id');
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
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "Unauthenticated user",
            })
        );
    }

};


export const createProduct = async (req: IncomingMessage, res: ServerResponse) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await Users.findOne(userId);
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
                        const product = new Product({
                            id: uuidv4(),
                            name: name,
                            category: category,
                            description: description,
                            price: price,
                            stock: stock,
                            image: image
                        });
                        try { await product.save(); } catch (err) {
                            res.statusCode = 400;
                            res.end();
                            return;
                        }

                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ id: product.id }));
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

export const updateProduct = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await Users.findOne(userId);
        if (user) {
            if (["A", "M"].includes(user.permission)) {
                const prod = await Product.findOne({ id: id });
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

                        const productData = {
                            name: name || prod.name,
                            category: category || prod.category,
                            description: description || prod.description,
                            price: price || prod.price,
                            stock: stock || prod.stock,
                            image: image || prod.image
                        }

                        await prod.updateOne(productData);

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

export const removeProduct = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    const userId = protectedRout(req, res);
    if (userId !== ERROR_401) {
        const user = await Users.findOne(userId);
        if (user) {
            if (user.permission == "A") {
                const prod = await Product.findOne({ id: id });

                if (prod) {
                    await prod.delete();
                    // await Product.deleteOne({ id:prod.id});
                }

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
