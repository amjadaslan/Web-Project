import { Request, Response } from "express";
import OrderService from "./OrderService.js";

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
        res.end(JSON.stringify({ message: "Cart does not exist!" }));
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(order));
    return;
}


const createOrder = async (req: Request, res: Response, userName: string) => {
    const customerName = userName;
    const streetAddress = req.params.streetAddress;
    const apartment = req.params.apartment;
    const city = req.params.city;
    const state = req.params.state;
    const country = req.params.country;
    const zipCode = req.params.zipCode;
    const order = await orderService.createOrder({ customerName, streetAddress, apartment, city, state, country, zipCode });
    if (!order) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end({ message: "Error! Order could not be created." });
        return;
    }
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