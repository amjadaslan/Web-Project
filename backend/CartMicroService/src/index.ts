import { Request, Response } from "express";
import CartService from "./CartService.js";

const cartService = new CartService();

export default (app) => {
    app.get('/api/cart/:userid', function (req: Request, res: Response) { getCart(req, res, req.params.userid); });

    app.post('/api/cart/:userid', function (req: Request, res: Response) { addToCart(req, res, req.params.userid); });

    app.put('/api/cart/:userid', function (req: Request, res: Response) { updateCartItem(req, res, req.params.userid); });

    app.delete('/api/cart/:userid', function (req: Request, res: Response) { removeCart(req, res, req.params.userid); });


}

//TODO: #7 Add try\catch to all functions using mongoose methods

//Retrieves the cart of the specified user.
const getCart = async (req: Request, res: Response, userId: string) => {
    let cart;
    try {
        cart = await cartService.getCart(userId);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    if (!cart) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Cart does not exist!" }));
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(cart));
    return;
}

//Adds an item to the cart of the specified user.
const addToCart = async (req: Request, res: Response, userId: string) => {
    const prodId = req.body.prodId;
    const prodCount = req.body.prodCount;
    const prodPrice = req.body.prodPrice;
    if (typeof prodCount != 'number' || typeof prodPrice != 'number' || !Number.isInteger(prodCount)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid Details" }));
        return;
    }
    try {
        await cartService.addToCart(userId, prodCount, prodId, prodPrice);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end();
}

//Updates the specified item in the cart of the specified user.
const updateCartItem = async (req: Request, res: Response, userId: string) => {
    const prodId = req.body.prodId;
    const prodCount = req.body.prodCount;
    if (typeof prodCount != 'number' || !Number.isInteger(prodCount)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid Details" }));
        return;
    }
    try {
        await cartService.updateCartItem(userId, prodCount, prodId);
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end();
}

//Removes a cart of the specified user.
const removeCart = async (req: Request, res: Response, userId: string) => {
    try { await cartService.removeCart(userId); } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
}