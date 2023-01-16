import { Request, Response } from "express";
import OrderService from "./OrderService.js";
import axios from "axios";


const orderService = new OrderService();

export default (app) => {

    app.get('/api/order/:orderId', function (req: Request, res: Response) { getOrder(req, res, req.params.orderId); });

    app.post('/api/order/:username', function (req: Request, res: Response) { createOrder(req, res, req.params.username); });

    app.put('/api/order/:orderId', function (req: Request, res: Response) { markAsDelivered(req, res, req.params.orderId); });
}

const getOrder = async (req: Request, res: Response, orderId: string) => {
    const order = await orderService.getOrder(orderId);
    if (!order) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Order does not exist!" }));
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(order));
    return;
}


const createOrder = async (req: Request, res: Response, userName: string) => {
    const customerName = userName;
    const streetAddress = req.body.streetAddress;
    const apartment = req.body.apartment;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const zipCode = req.body.zipCode;
    const userId = req.body.userId;
    const order = await orderService.createOrder({ customerName, streetAddress, apartment, city, state, country, zipCode });
    if (!order) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end({ message: "Error! Order could not be created." });
        return;
    }
    const cartRes = await axios.get(`${process.env.CART}/api/cart/${userId}`);
    const cart = cartRes.data.cart;
    for (let item of cart.items) {
        const productRes = await axios.get(`${process.env.PRODUCT}/api/product/${item.productId}`);
        const product = cartRes.data.product;
        const newStock = product.stock - item.count;
        await axios.put(`${process.env.PRODUCT}/api/product/${item.productId}`, { newStock });
    }
    await axios.delete(`${process.env.CART}/api/cart/${userId}`);
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ id: order.id }));
    return;

}

const markAsDelivered = async (req: Request, res: Response, orderId: string) => {
    const order = await orderService.getOrder(orderId);
    if (!order) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Order does not exist!" }));
        return;
    }
    await orderService.markAsDelivered(orderId);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ id: order.id }));
    return;
}